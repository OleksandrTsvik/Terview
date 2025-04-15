using Domain.Users;
using Infrastructure.Options;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace Infrastructure.Jobs;

public class DeleteUsersJob : IJob
{
    private readonly int _afterDays;
    private readonly IMongoCollection<User> _usersCollection;

    public DeleteUsersJob(
        IOptions<JobsOptions> jobsOptions,
        IMongoCollection<User> usersCollection)
    {
        _afterDays = jobsOptions.Value.DeleteUsersAfterDays;
        _usersCollection = usersCollection;
    }

    public async Task Run(CancellationToken cancellationToken = default)
    {
        await _usersCollection.DeleteManyAsync(
            user =>
                user.DeletedOnUtc.HasValue &&
                user.DeletedOnUtc.Value.AddDays(_afterDays) < DateTime.UtcNow,
            cancellationToken);
    }
}
