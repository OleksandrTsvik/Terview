using Api.Authentication;
using Api.Options;
using Api.Scheduler;
using Domain.Users;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace Api;

public class DatabaseInitializer
{
    private readonly SeedOptions _seedOptions;
    private readonly PasswordHasher _passwordHasher;
    private readonly IMongoCollection<User> _usersCollection;
    private readonly IMongoCollection<Job> _jobsCollection;
    private readonly ILogger<DatabaseInitializer> _logger;

    public DatabaseInitializer(
        IOptions<SeedOptions> seedOptions,
        PasswordHasher passwordHasher,
        IMongoCollection<User> usersCollection,
        IMongoCollection<Job> jobsCollection,
        ILogger<DatabaseInitializer> logger)
    {
        _seedOptions = seedOptions.Value;
        _passwordHasher = passwordHasher;
        _usersCollection = usersCollection;
        _jobsCollection = jobsCollection;
        _logger = logger;
    }

    public async Task Execute(CancellationToken stoppingToken = default)
    {
        try
        {
            _logger.LogInformation("Starting database initialization.");

            await SeedInitialDataAsync(stoppingToken);

            _logger.LogInformation("Database initialization completed successfully.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while initializing the database.");
        }
    }

    private async Task SeedInitialDataAsync(CancellationToken cancellationToken)
    {
        await SeedUsersAsync(cancellationToken);
        await SeedJobsAsync(cancellationToken);
    }

    private async Task SeedUsersAsync(CancellationToken cancellationToken)
    {
        bool hasAnyUsers = await _usersCollection
            .Find(_ => true)
            .AnyAsync(cancellationToken);

        if (hasAnyUsers)
        {
            return;
        }

        var users = _seedOptions.Users
            .Select(user => new User
            {
                Email = user.Email,
                EmailVerified = true,
                PasswordHash = _passwordHasher.Hash(user.Password),
                Permissions = user.Permissions ?? []
            })
            .ToList();

        await _usersCollection.InsertManyAsync(users, null, cancellationToken);
    }

    private async Task SeedJobsAsync(CancellationToken cancellationToken)
    {
        var requests = SeedJobs.Jobs
            .Select(insert => new UpdateOneModel<Job>(
                Builders<Job>.Filter.Eq(job => job.Type, insert.Type),
                Builders<Job>.Update
                    .SetOnInsert(job => job.Type, insert.Type)
                    .SetOnInsert(job => job.Name, insert.Name)
                    .SetOnInsert(job => job.PeriodInSeconds, insert.PeriodInSeconds)
                    .SetOnInsert(job => job.LastRunStatus, insert.LastRunStatus)
                    .SetOnInsert(job => job.NextRunTimeInUtc, insert.NextRunTimeInUtc))
            { IsUpsert = true })
            .ToList();

        await _jobsCollection.BulkWriteAsync(requests, null, cancellationToken);
    }
}
