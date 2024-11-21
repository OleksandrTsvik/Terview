using Api.Middleware;
using Api.Options;
using Domain.Notes;
using FluentValidation;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Serializers;
using MongoDB.Driver;
using MongoDB.Driver.Core.Events;
using SharedKernel;

namespace Api.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddExceptionHandler(this IServiceCollection services)
    {
        services.AddExceptionHandler<GlobalExceptionHandler>();
        services.AddProblemDetails();

        return services;
    }

    public static IServiceCollection AddFluentValidation(this IServiceCollection services)
    {
        services.AddValidatorsFromAssembly(AssemblyReference.Assembly);

        return services;
    }

    public static IServiceCollection AddMongoDb(this IServiceCollection services)
    {
        BsonSerializer.RegisterSerializer(new GuidSerializer(GuidRepresentation.Standard));

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
                        Console.WriteLine($"{@event.CommandName} - {@event.Command.ToJson()}");
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
        services.AddMongoCollection<Note>("notes");

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
