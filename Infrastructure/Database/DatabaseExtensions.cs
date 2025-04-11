using Domain.Notes;
using Domain.Users;
using Infrastructure.Options;
using Infrastructure.Outbox;
using Infrastructure.Scheduler;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Conventions;
using MongoDB.Bson.Serialization.Serializers;
using MongoDB.Driver;
using MongoDB.Driver.Core.Events;
using SharedKernel;

namespace Infrastructure.Database;

public static class DatabaseExtensions
{
    public static IServiceCollection AddDatabase(this IServiceCollection services)
    {
        services.AddMongoDb();

        services.AddScoped<DatabaseInitializer>();

        return services;
    }

    private static IServiceCollection AddMongoDb(this IServiceCollection services)
    {
        BsonSerializer.RegisterSerializer(new GuidSerializer(GuidRepresentation.Standard));

        var pack = new ConventionPack
        {
            new IgnoreExtraElementsConvention(true),
            new EnumRepresentationConvention(BsonType.String),
        };

        ConventionRegistry.Register("Global Conventions", pack, _ => true);

        BsonClassMap.RegisterClassMap<User>(classMap =>
        {
            classMap.AutoMap();
            classMap.MapMember(user => user.Permissions)
                .SetSerializer(new EnumerableInterfaceImplementerSerializer<List<PermissionType>>(
                    new EnumSerializer<PermissionType>(BsonType.String)));
        });

        services
            .AddMongoClient()
            .AddMongoDatabase()
            .AddMongoCollections();

        return services;
    }

    private static IServiceCollection AddMongoClient(this IServiceCollection services)
    {
        services.AddSingleton<IMongoClient, MongoClient>(serviceProvider =>
        {
            MongoDbOptions mongoDbOptions = serviceProvider.GetRequiredService<
                IOptions<MongoDbOptions>>().Value;

            var settings = MongoClientSettings.FromConnectionString(mongoDbOptions.ConnectionString);

            if (EnvironmentHelper.IsLocal)
            {
                settings.ClusterConfigurator = clusterBuilder =>
                {
                    clusterBuilder.Subscribe<CommandStartedEvent>(@event =>
                    {
                        string timestamp = @event.Timestamp.ToLocalTime().ToString("HH:mm:ss");
                        Console.WriteLine($"[{timestamp} MONGO] {@event.CommandName} - {@event.Command.ToJson()}");
                    });
                };
            }

            return new MongoClient(settings);
        });

        return services;
    }

    private static IServiceCollection AddMongoDatabase(this IServiceCollection services)
    {
        services.AddSingleton<IMongoDatabase>(serviceProvider =>
        {
            MongoDbOptions mongoDbOptions = serviceProvider.GetRequiredService<
                IOptions<MongoDbOptions>>().Value;

            IMongoClient mongoClient = serviceProvider.GetRequiredService<IMongoClient>();

            return mongoClient.GetDatabase(mongoDbOptions.DatabaseName);
        });

        return services;
    }

    private static IServiceCollection AddMongoCollections(this IServiceCollection services)
    {
        services.AddMongoCollection<Log>("logs");
        services.AddMongoCollection<OutboxMessage>("outbox_messages");
        services.AddMongoCollection<Job>("jobs");

        services.AddMongoCollection<Note>("notes");
        services.AddMongoCollection<NoteImage>("note_images");

        services.AddMongoCollection<User>("users");
        services.AddMongoCollection<EmailVerificationToken>("email_verification_tokens");
        services.AddMongoCollection<PasswordResetToken>("password_reset_tokens");
        services.AddMongoCollection<RefreshToken>("refresh_tokens");

        return services;
    }

    private static IServiceCollection AddMongoCollection<TDocument>(
        this IServiceCollection services,
        string collectionName)
    {
        services.AddSingleton<IMongoCollection<TDocument>>(serviceProvider =>
            serviceProvider
                .GetRequiredService<IMongoDatabase>()
                .GetCollection<TDocument>(collectionName));

        return services;
    }
}
