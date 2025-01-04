using System.Reflection;
using Api.Authentication;
using Api.Endpoints.Logs;
using Api.Endpoints.Notes.Create;
using Api.Endpoints.Notes.Update;
using Api.Endpoints.Users.Create;
using Api.Events;
using Api.Infrastructure;
using Api.Jobs;
using Api.Middleware;
using Api.Options;
using Api.Outbox;
using Api.Scheduler;
using Domain.Notes;
using Domain.Users;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Conventions;
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

    public static IServiceCollection AddApiCors(this IServiceCollection services, WebApplicationBuilder builder)
    {
        CorsOptions? corsOptions = builder.Configuration
            .GetSection(CorsOptions.ConfigurationSectionName)
            .Get<CorsOptions>();

        services.AddCors(options =>
        {
            options.AddPolicy("CorsPolicy", policy =>
            {
                policy
                    .WithOrigins(corsOptions?.Origins ?? [])
                    .AllowCredentials()
                    .AllowAnyMethod()
                    .AllowAnyHeader();
            });
        });

        return services;
    }

    public static IServiceCollection AddAuth(this IServiceCollection services)
    {
        services.AddHttpContextAccessor();

        services.AddSingleton<PasswordHasher>();
        services.AddSingleton<TokenProvider>();
        services.AddScoped<UserContext>();

        services.ConfigureOptions<JwtBearerOptionsConfiguration>();

        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer();

        services.AddAuthorization();

        return services;
    }

    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        services.AddScoped<IImageProvider, CloudinaryImageProvider>();

        return services;
    }

    public static IServiceCollection AddEvents(this IServiceCollection services)
    {
        services.AddScoped<IEventBus, EventBus>();
        services.AddScoped<IEventPublisher, EventPublisher>();

        services.AddScoped<IEventHandler<CreateNoteEvent>, CreateNoteEventHandler>();
        services.AddScoped<IEventHandler<UpdateNoteEvent>, UpdateNoteEventHandler>();
        services.AddScoped<IEventHandler<CreateUserEvent>, CreateUserEventHandler>();

        services.AddScoped<OutboxProcessor>();
        services.AddHostedService<OutboxBackgroundService>();

        return services;
    }

    public static IServiceCollection AddJobs(this IServiceCollection services)
    {
        TypeInfo[] jopTypes = AssemblyReference.Assembly
            .DefinedTypes
            .Where(type =>
                type is { IsAbstract: false, IsInterface: false } &&
                type.IsAssignableTo(typeof(IJob)))
            .ToArray();

        foreach (TypeInfo jobType in jopTypes)
        {
            services.AddScoped(jobType);
        }

        services.AddScoped<SchedulerProcessor>();
        services.AddHostedService<SchedulerBackgroundService>();

        return services;
    }

    public static IServiceCollection AddMongoDb(this IServiceCollection services)
    {
        BsonSerializer.RegisterSerializer(new GuidSerializer(GuidRepresentation.Standard));

        var pack = new ConventionPack
        {
            new IgnoreExtraElementsConvention(true),
            new EnumRepresentationConvention(BsonType.String),
        };

        ConventionRegistry.Register("Global Conventions", pack, _ => true);

        services
            .AddMongoClient()
            .AddMongoDatabase()
            .AddMongoCollections()
            .AddSingleton<DatabaseInitializer>();

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
