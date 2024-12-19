using Api.Authentication;
using Api.Options;
using Domain.Users;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace Api;

public class DatabaseInitializer
{
    private readonly SeedOptions _seedOptions;
    private readonly PasswordHasher _passwordHasher;
    private readonly IMongoCollection<User> _usersCollection;
    private readonly ILogger<DatabaseInitializer> _logger;

    public DatabaseInitializer(
        IOptions<SeedOptions> seedOptions,
        PasswordHasher passwordHasher,
        IMongoCollection<User> usersCollection,
        ILogger<DatabaseInitializer> logger)
    {
        _seedOptions = seedOptions.Value;
        _passwordHasher = passwordHasher;
        _usersCollection = usersCollection;
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
                PasswordHash = _passwordHasher.Hash(user.Password)
            })
            .ToList();

        await _usersCollection.InsertManyAsync(users, null, cancellationToken);
    }
}
