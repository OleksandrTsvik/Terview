using Api.Extensions;
using Api.Infrastructure;
using Domain.Users;
using Microsoft.AspNetCore.Http.HttpResults;
using MongoDB.Driver;

namespace Api.Endpoints.Users.ForgotPassword;

public class ForgotPasswordEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("users/forgot-password", Handler)
            .WithRequestValidation<ForgotPasswordRequest>()
            .WithTags(Tags.Users);
    }

    public static async Task<Results<NoContent, BadRequest>> Handler(
        ForgotPasswordRequest request,
        IMongoCollection<User> usersCollection,
        IMongoCollection<PasswordResetToken> passwordResetTokensCollection,
        PasswordResetTokenFactory passwordResetTokenFactory,
        IEmailSender emailSender,
        CancellationToken cancellationToken)
    {
        User? user = await usersCollection
            .Find(user =>
                user.Email == request.Email &&
                user.EmailVerified &&
                user.DeletedOnUtc == null &&
                user.DeletedBy == null)
            .FirstOrDefaultAsync(cancellationToken);

        if (user is null)
        {
            return TypedResults.BadRequest();
        }

        PasswordResetToken? passwordResetToken = await passwordResetTokenFactory
            .CreateAsync(user.Id, cancellationToken);

        if (passwordResetToken is null)
        {
            return TypedResults.BadRequest();
        }

        await passwordResetTokensCollection.InsertOneAsync(passwordResetToken, null, cancellationToken);

        string passwordResetLink = passwordResetTokenFactory.CreateLink(passwordResetToken.Token);

        await emailSender.SendHtmlAsync(
            user.Email,
            "[Terview] Скидання пароля",
            $"""
                Щоб скинути пароль, <a href='{passwordResetLink}'>натисніть тут</a>.<br /><br />
                Якщо Ви не надсилали запит на зміну пароля, можете сміливо ігнорувати цей лист.
            """,
            cancellationToken);

        return TypedResults.NoContent();
    }
}
