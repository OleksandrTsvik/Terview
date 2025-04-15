using Domain.Notes;
using Domain.Users;
using Infrastructure.Authentication;
using Infrastructure.Options;
using Infrastructure.Scheduler;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;

namespace Infrastructure.Database;

public class DatabaseInitializer
{
    private readonly ILogger<DatabaseInitializer> _logger;
    private readonly SeedOptions _seedOptions;
    private readonly PasswordHasher _passwordHasher;
    private readonly IMongoCollection<User> _usersCollection;
    private readonly IMongoCollection<Job> _jobsCollection;
    private readonly IMongoCollection<Note> _notesCollection;

    public DatabaseInitializer(
        ILogger<DatabaseInitializer> logger,
        IOptions<SeedOptions> seedOptions,
        PasswordHasher passwordHasher,
        IMongoCollection<User> usersCollection,
        IMongoCollection<Job> jobsCollection,
        IMongoCollection<Note> notesCollection)
    {
        _logger = logger;
        _seedOptions = seedOptions.Value;
        _passwordHasher = passwordHasher;
        _usersCollection = usersCollection;
        _jobsCollection = jobsCollection;
        _notesCollection = notesCollection;
    }

    public async Task Execute(CancellationToken stoppingToken = default)
    {
        try
        {
            _logger.LogInformation("Starting database initialization.");

            await ConfigureDatabaseIndexes(stoppingToken);
            await SeedInitialDataAsync(stoppingToken);

            _logger.LogInformation("Database initialization completed successfully.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while initializing the database.");
        }
    }

    private async Task ConfigureDatabaseIndexes(CancellationToken cancellationToken)
    {
        await ConfigureNoteIndexes(cancellationToken);
    }

    private async Task ConfigureNoteIndexes(CancellationToken cancellationToken)
    {
        var indexModels = new List<CreateIndexModel<Note>>
        {
            new(
                Builders<Note>.IndexKeys.Ascending(note => note.Slug),
                new CreateIndexOptions { Name = "Slug_Asc", Unique = true }),
            new(
                Builders<Note>.IndexKeys
                    .Text(note => note.Title)
                    .Text(note => note.Content),
                new CreateIndexOptions { Name = "Title_Text_Content_Text", }),
            new(
                Builders<Note>.IndexKeys.Ascending(note => note.Tags),
                new CreateIndexOptions { Name = "Tags_Asc" }),
        };

        await CreateIndexesAsync(_notesCollection, indexModels, cancellationToken);
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
                    .SetOnInsert(job => job.CronExpression, insert.CronExpression)
                    .SetOnInsert(job => job.LastRunStatus, insert.LastRunStatus)
                    .SetOnInsert(job => job.NextRunTimeInUtc, insert.NextRunTimeInUtc))
            { IsUpsert = true })
            .ToList();

        await _jobsCollection.BulkWriteAsync(requests, null, cancellationToken);
    }

    private async Task CreateIndexesAsync<TDocument>(
        IMongoCollection<TDocument> collection,
        IEnumerable<CreateIndexModel<TDocument>> indexModels,
        CancellationToken cancellationToken)
    {
        try
        {
            await DropExistingIndexesWithDifferentNamesAsync(collection, indexModels, cancellationToken);
            await collection.Indexes.CreateManyAsync(indexModels, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "{Message}", ex.Message);
        }
    }

    private async Task DropExistingIndexesWithDifferentNamesAsync<TDocument>(
        IMongoCollection<TDocument> collection,
        IEnumerable<CreateIndexModel<TDocument>> indexModels,
        CancellationToken cancellationToken)
    {
        try
        {
            List<BsonDocument> existingIndexes = await collection.Indexes
                .List(cancellationToken)
                .ToListAsync(cancellationToken);

            foreach (CreateIndexModel<TDocument> indexModel in indexModels)
            {
                RenderArgs<TDocument> renderArgs = new()
                {
                    DocumentSerializer = BsonSerializer.SerializerRegistry.GetSerializer<TDocument>(),
                    SerializerRegistry = BsonSerializer.SerializerRegistry,
                };

                BsonDocument indexKeys = indexModel.Keys.Render(renderArgs);
                BsonDocument? existingIndex = existingIndexes.FirstOrDefault(index => index["key"] == indexKeys);

                if (existingIndex == null)
                {
                    continue;
                }

                string existingIndexName = existingIndex["name"].AsString;
                string newIndexName = indexModel.Options.Name;

                if (existingIndexName != newIndexName)
                {
                    await collection.Indexes.DropOneAsync(existingIndexName, cancellationToken);
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "{Message}", ex.Message);
        }
    }
}
