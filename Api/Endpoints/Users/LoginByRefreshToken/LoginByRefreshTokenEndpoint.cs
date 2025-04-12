using Domain.Users;
using Infrastructure.Authentication;
using Microsoft.AspNetCore.Http.HttpResults;
using MongoDB.Driver;

namespace Api.Endpoints.Users.LoginByRefreshToken;

public class LoginByRefreshTokenEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("users/refresh-token", Handler)
            .WithRequestValidation<LoginByRefreshTokenRequest>()
            .WithTags(Tags.Users);
    }

    public static async Task<Results<Ok<LoginByRefreshTokenResponse>, BadRequest>> Handler(
        LoginByRefreshTokenRequest request,
        TokenProvider tokenProvider,
        IMongoCollection<User> usersCollection,
        IMongoCollection<RefreshToken> refreshTokensCollection,
        CancellationToken cancellationToken)
    {
        RefreshToken? refreshToken = await refreshTokensCollection
            .Find(x => x.Token == request.RefreshToken)
            .FirstOrDefaultAsync(cancellationToken);

        if (refreshToken is null || refreshToken.ExpiresOnUtc < DateTime.UtcNow)
        {
            return TypedResults.BadRequest();
        }

        User? user = await usersCollection
            .Find(user =>
                user.Id == refreshToken.UserId &&
                user.EmailVerified &&
                user.DeletedOnUtc == null &&
                user.DeletedBy == null)
            .FirstOrDefaultAsync(cancellationToken);

        if (user is null)
        {
            return TypedResults.BadRequest();
        }

        TokenInfo accessTokenInfo = tokenProvider.GenerateAccessToken(user);
        TokenInfo refreshTokenInfo = tokenProvider.GenerateRefreshToken();

        refreshToken.Token = refreshTokenInfo.Token;
        refreshToken.ExpiresOnUtc = refreshTokenInfo.ExpiresOnUtc;

        await refreshTokensCollection.ReplaceOneAsync(
            x => x.Id == refreshToken.Id,
            refreshToken,
            new ReplaceOptions { IsUpsert = true },
            cancellationToken);

        var response = new LoginByRefreshTokenResponse
        {
            Email = user.Email,
            Permissions = user.Permissions,
            AccessToken = accessTokenInfo.Token,
            RefreshToken = refreshToken.Token
        };

        return TypedResults.Ok(response);
    }
}
