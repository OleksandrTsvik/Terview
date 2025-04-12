using Domain.Users;
using Infrastructure.Authentication;
using Microsoft.AspNetCore.Http.HttpResults;
using MongoDB.Driver;

namespace Api.Endpoints.Users.Login;

public class LoginEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("users/login", Handler)
            .WithRequestValidation<LoginRequest>()
            .WithTags(Tags.Users);
    }

    public static async Task<Results<Ok<LoginResponse>, BadRequest>> Handler(
        LoginRequest request,
        PasswordHasher passwordHasher,
        TokenProvider tokenProvider,
        IMongoCollection<User> usersCollection,
        IMongoCollection<RefreshToken> refreshTokensCollection,
        CancellationToken cancellationToken)
    {
        User? user = await usersCollection
            .Find(user =>
                user.Email == request.Email &&
                user.EmailVerified &&
                user.PasswordHash != null &&
                user.DeletedOnUtc == null &&
                user.DeletedBy == null)
            .FirstOrDefaultAsync(cancellationToken);

        if (user is null)
        {
            return TypedResults.BadRequest();
        }

        bool verified = passwordHasher.Verify(request.Password, user.PasswordHash!);

        if (!verified)
        {
            return TypedResults.BadRequest();
        }

        TokenInfo accessTokenInfo = tokenProvider.GenerateAccessToken(user);
        TokenInfo refreshTokenInfo = tokenProvider.GenerateRefreshToken();

        var refreshToken = new RefreshToken
        {
            UserId = user.Id,
            Token = refreshTokenInfo.Token,
            ExpiresOnUtc = refreshTokenInfo.ExpiresOnUtc,
        };

        await refreshTokensCollection.InsertOneAsync(refreshToken, null, cancellationToken);

        var response = new LoginResponse
        {
            Email = user.Email,
            Permissions = user.Permissions,
            AccessToken = accessTokenInfo.Token,
            RefreshToken = refreshToken.Token
        };

        return TypedResults.Ok(response);
    }
}
