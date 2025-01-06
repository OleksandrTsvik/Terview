using Domain.Users;
using MongoDB.Driver;

namespace Api.Jobs;

public class DeleteExpiredPasswordResetTokensJob : IJob
{
    private readonly IMongoCollection<PasswordResetToken> _passwordResetTokensCollection;

    public DeleteExpiredPasswordResetTokensJob(
        IMongoCollection<PasswordResetToken> passwordResetTokensCollection)
    {
        _passwordResetTokensCollection = passwordResetTokensCollection;
    }

    public async Task Run(CancellationToken cancellationToken = default)
    {
        await _passwordResetTokensCollection.DeleteManyAsync(
            passwordResetToken => passwordResetToken.ExpiresOnUtc < DateTime.UtcNow,
            cancellationToken);
    }
}
