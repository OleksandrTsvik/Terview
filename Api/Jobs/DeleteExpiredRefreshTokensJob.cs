using Domain.Users;
using MongoDB.Driver;

namespace Api.Jobs;

public class DeleteExpiredRefreshTokensJob : IJob
{
    private readonly IMongoCollection<RefreshToken> _refreshTokensCollection;

    public DeleteExpiredRefreshTokensJob(IMongoCollection<RefreshToken> refreshTokensCollection)
    {
        _refreshTokensCollection = refreshTokensCollection;
    }

    public async Task Run(CancellationToken cancellationToken = default)
    {
        await _refreshTokensCollection.DeleteManyAsync(
            refreshToken => refreshToken.ExpiresOnUtc < DateTime.UtcNow,
            cancellationToken);
    }
}
