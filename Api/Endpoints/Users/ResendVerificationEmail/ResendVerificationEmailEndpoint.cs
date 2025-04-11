using Domain.Users;
using Infrastructure.Email;
using Microsoft.AspNetCore.Http.HttpResults;
using MongoDB.Driver;

namespace Api.Endpoints.Users.ResendVerificationEmail;

public class ResendVerificationEmailEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("users/resend-verification-email/{userId:guid}", Handler)
            .WithTags(Tags.Users)
            .HasPermission(PermissionType.ResendVerificationEmail);
    }

    public static async Task<Results<NoContent, BadRequest>> Handler(
        Guid userId,
        IMongoCollection<User> usersCollection,
        IMongoCollection<EmailVerificationToken> emailVerificationTokensCollection,
        EmailVerificationTokenFactory emailVerificationTokenFactory,
        IEmailSender emailSender,
        CancellationToken cancellationToken)
    {
        User? user = await usersCollection
            .Find(user =>
                user.Id == userId &&
                user.DeletedOnUtc == null &&
                user.DeletedBy == null)
            .FirstOrDefaultAsync(cancellationToken);

        if (user is null || user.EmailVerified)
        {
            return TypedResults.BadRequest();
        }

        EmailVerificationToken emailVerificationToken = emailVerificationTokenFactory.Create(user.Id);

        await emailVerificationTokensCollection.InsertOneAsync(emailVerificationToken, null, cancellationToken);

        string verificationLink = emailVerificationTokenFactory.CreateLink(emailVerificationToken.Token);

        await emailSender.SendHtmlAsync(
            user.Email,
            "[Terview] Підтвердження електронної пошти",
            $"Щоб підтвердити свою електронну адресу, <a href='{verificationLink}'>натисніть тут</a>.",
            cancellationToken);

        return TypedResults.NoContent();
    }
}
