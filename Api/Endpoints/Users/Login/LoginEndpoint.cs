using Api.Authentication;
using Api.Extensions;
using Domain.Users;
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
            .Find(user => user.Email == request.Email)
            .FirstOrDefaultAsync(cancellationToken);

        if (user is null)
        {
            return TypedResults.BadRequest();
        }

        bool verified = passwordHasher.Verify(request.Password, user.PasswordHash);

        if (!verified)
        {
            return TypedResults.BadRequest();
        }

        string accessToken = tokenProvider.GenerateAccessToken(user);

        var refreshToken = new RefreshToken
        {
            UserId = user.Id,
            Token = tokenProvider.GenerateRefreshToken(),
            ExpiresOnUtc = DateTime.UtcNow.AddDays(tokenProvider.RefreshTokenExpirationInDays)
        };

        await refreshTokensCollection.InsertOneAsync(refreshToken, null, cancellationToken);

        var response = new LoginResponse
        {
            Email = user.Email,
            AccessToken = accessToken,
            RefreshToken = refreshToken.Token
        };

        return TypedResults.Ok(response);
    }
}
