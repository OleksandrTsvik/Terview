using Domain.Users;
using Infrastructure.Authentication;
using Microsoft.AspNetCore.Http.HttpResults;
using MongoDB.Driver;

namespace Api.Endpoints.Users.VerifyEmail;

public class VerifyEmailEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("users/verify-email", Handler)
            .WithRequestValidation<VerifyEmailRequest>()
            .WithTags(Tags.Users);
    }

    public static async Task<Results<NoContent, BadRequest>> Handler(
        VerifyEmailRequest request,
        PasswordHasher passwordHasher,
        IMongoCollection<EmailVerificationToken> emailVerificationTokensCollection,
        IMongoCollection<User> usersCollection,
        CancellationToken cancellationToken)
    {
        EmailVerificationToken? emailVerificationToken = await emailVerificationTokensCollection
            .Find(x => x.Token == request.Token)
            .FirstOrDefaultAsync(cancellationToken);

        if (emailVerificationToken is null || emailVerificationToken.ExpiresOnUtc < DateTime.UtcNow)
        {
            return TypedResults.BadRequest();
        }

        User? user = await usersCollection
            .Find(user =>
                user.Id == emailVerificationToken.UserId &&
                user.DeletedOnUtc == null &&
                user.DeletedBy == null)
            .FirstOrDefaultAsync(cancellationToken);

        if (user is null || user.EmailVerified)
        {
            return TypedResults.BadRequest();
        }

        string passwordHash = passwordHasher.Hash(request.Password);

        FilterDefinition<User> userFilter = Builders<User>.Filter.Eq(user => user.Id, user.Id);
        UpdateDefinition<User> userUpdate = Builders<User>.Update
            .Set(user => user.EmailVerified, true)
            .Set(user => user.PasswordHash, passwordHash);

        await usersCollection.UpdateOneAsync(userFilter, userUpdate, null, cancellationToken);

        await emailVerificationTokensCollection.DeleteManyAsync(
            x => x.UserId == user.Id, cancellationToken);

        return TypedResults.NoContent();
    }
}
