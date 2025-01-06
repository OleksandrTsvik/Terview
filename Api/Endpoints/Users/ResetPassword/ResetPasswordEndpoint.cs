using Api.Authentication;
using Api.Extensions;
using Domain.Users;
using Microsoft.AspNetCore.Http.HttpResults;
using MongoDB.Driver;

namespace Api.Endpoints.Users.ResetPassword;

public class ResetPasswordEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("users/reset-password", Handler)
            .WithRequestValidation<ResetPasswordRequest>()
            .WithTags(Tags.Users);
    }

    public static async Task<Results<NoContent, BadRequest>> Handler(
        ResetPasswordRequest request,
        PasswordHasher passwordHasher,
        IMongoCollection<PasswordResetToken> passwordResetTokensCollection,
        IMongoCollection<User> usersCollection,
        CancellationToken cancellationToken)
    {
        PasswordResetToken? passwordResetToken = await passwordResetTokensCollection
            .Find(x => x.Token == request.Token)
            .FirstOrDefaultAsync(cancellationToken);

        if (passwordResetToken is null || passwordResetToken.ExpiresOnUtc < DateTime.UtcNow)
        {
            return TypedResults.BadRequest();
        }

        User? user = await usersCollection
            .Find(user =>
                user.Id == passwordResetToken.UserId &&
                user.EmailVerified &&
                user.DeletedOnUtc == null &&
                user.DeletedBy == null)
            .FirstOrDefaultAsync(cancellationToken);

        if (user is null)
        {
            return TypedResults.BadRequest();
        }

        string passwordHash = passwordHasher.Hash(request.Password);

        FilterDefinition<User> userFilter = Builders<User>.Filter.Eq(user => user.Id, user.Id);
        UpdateDefinition<User> userUpdate = Builders<User>.Update
            .Set(user => user.PasswordHash, passwordHash);

        await usersCollection.UpdateOneAsync(userFilter, userUpdate, null, cancellationToken);

        await passwordResetTokensCollection.DeleteOneAsync(
            x => x.Token == passwordResetToken.Token, cancellationToken);

        return TypedResults.NoContent();
    }
}
