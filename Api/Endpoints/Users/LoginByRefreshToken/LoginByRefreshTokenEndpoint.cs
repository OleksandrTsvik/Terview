using Api.Authentication;
using Api.Extensions;
using Domain.Users;
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

        string accessToken = tokenProvider.GenerateAccessToken(user);

        refreshToken.Token = tokenProvider.GenerateRefreshToken();
        refreshToken.ExpiresOnUtc = DateTime.UtcNow.AddDays(tokenProvider.RefreshTokenExpirationInDays);

        await refreshTokensCollection.ReplaceOneAsync(
            x => x.Id == refreshToken.Id,
            refreshToken,
            new ReplaceOptions { IsUpsert = true },
            cancellationToken);

        var response = new LoginByRefreshTokenResponse
        {
            Email = user.Email,
            AccessToken = accessToken,
            RefreshToken = refreshToken.Token
        };

        return TypedResults.Ok(response);
    }
}
