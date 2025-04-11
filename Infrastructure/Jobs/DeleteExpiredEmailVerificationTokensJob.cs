using Domain.Users;
using MongoDB.Driver;

namespace Infrastructure.Jobs;

public class DeleteExpiredEmailVerificationTokensJob : IJob
{
    private readonly IMongoCollection<EmailVerificationToken> _emailVerificationTokensCollection;

    public DeleteExpiredEmailVerificationTokensJob(
        IMongoCollection<EmailVerificationToken> emailVerificationTokensCollection)
    {
        _emailVerificationTokensCollection = emailVerificationTokensCollection;
    }

    public async Task Run(CancellationToken cancellationToken = default)
    {
        await _emailVerificationTokensCollection.DeleteManyAsync(
            emailVerificationToken => emailVerificationToken.ExpiresOnUtc < DateTime.UtcNow,
            cancellationToken);
    }
}
