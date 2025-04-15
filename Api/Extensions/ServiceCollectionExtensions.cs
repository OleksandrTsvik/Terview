using Api.Endpoints.Notes.Create;
using Api.Endpoints.Notes.Update;
using Api.Endpoints.Users.Create;
using Api.Middleware;
using Api.Options.Models;
using FluentValidation;
using Infrastructure.Events;

namespace Api.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddExceptionHandler(this IServiceCollection services)
    {
        services.AddExceptionHandler<GlobalExceptionHandler>();
        services.AddProblemDetails();

        return services;
    }

    public static IServiceCollection AddApiCors(
        this IServiceCollection services,
        ConfigurationManager configuration)
    {
        CorsOptions? corsOptions = configuration
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

    public static IServiceCollection AddEvents(this IServiceCollection services)
    {
        services.AddScoped<IEventHandler<CreateNoteEvent>, CreateNoteEventHandler>();
        services.AddScoped<IEventHandler<UpdateNoteEvent>, UpdateNoteEventHandler>();
        services.AddScoped<IEventHandler<CreateUserEvent>, CreateUserEventHandler>();

        return services;
    }

    public static IServiceCollection AddFluentValidation(this IServiceCollection services)
    {
        services.AddValidatorsFromAssembly(AssemblyReference.Assembly);

        return services;
    }
}
