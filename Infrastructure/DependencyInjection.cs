using System.Reflection;
using Infrastructure.Authentication;
using Infrastructure.Authorization;
using Infrastructure.Database;
using Infrastructure.Email;
using Infrastructure.Events;
using Infrastructure.Health;
using Infrastructure.Jobs;
using Infrastructure.Options;
using Infrastructure.Outbox;
using Infrastructure.Parsers;
using Infrastructure.Scheduler;
using Infrastructure.Storage;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        ConfigurationManager configuration)
    {
        services
            .AddApiAuthentication()
            .AddApiAuthorization()
            .AddDatabase()
            .AddEmail(configuration)
            .AddEvents()
            .AddHealth(configuration)
            .AddJobs()
            .AddOutbox()
            .AddParsers()
            .AddScheduler()
            .AddStorage();

        return services;
    }

    private static IServiceCollection AddApiAuthentication(this IServiceCollection services)
    {
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer();

        services.AddHttpContextAccessor();

        services.ConfigureOptions<JwtBearerOptionsConfiguration>();

        services.AddSingleton<PasswordHasher>();
        services.AddScoped<PasswordResetTokenFactory>();
        services.AddSingleton<TokenProvider>();
        services.AddScoped<UserContext>();

        return services;
    }

    private static IServiceCollection AddApiAuthorization(this IServiceCollection services)
    {
        services.AddAuthorization();

        services.AddSingleton<IAuthorizationHandler, PermissionAuthorizationHandler>();
        services.AddSingleton<IAuthorizationPolicyProvider, PermissionAuthorizationPolicyProvider>();
        services.AddScoped<PermissionProvider>();

        return services;
    }

    private static IServiceCollection AddEmail(this IServiceCollection services, ConfigurationManager configuration)
    {
        EmailOptions emailOptions = configuration
            .GetSection(EmailOptions.ConfigurationSectionName)
            .Get<EmailOptions>()!;

        services.AddFluentEmail(emailOptions.SenderEmail, emailOptions.SenderName)
            .AddSmtpSender(
                emailOptions.Host,
                emailOptions.Port,
                emailOptions.Username,
                emailOptions.Password);

        services.AddScoped<EmailVerificationTokenFactory>();
        services.AddScoped<IEmailSender, FluentEmailSender>();

        return services;
    }

    private static IServiceCollection AddEvents(this IServiceCollection services)
    {
        services.AddScoped<IEventBus, EventBus>();
        services.AddSingleton<IEventPublisher, EventPublisher>();

        return services;
    }

    private static IServiceCollection AddJobs(this IServiceCollection services)
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

        return services;
    }

    private static IServiceCollection AddOutbox(this IServiceCollection services)
    {
        services.AddScoped<OutboxProcessor>();
        services.AddHostedService<OutboxBackgroundService>();

        return services;
    }

    private static IServiceCollection AddParsers(this IServiceCollection services)
    {
        services.AddSingleton<IHtmlParser, HtmlParser>();

        return services;
    }

    private static IServiceCollection AddScheduler(this IServiceCollection services)
    {
        services.AddScoped<SchedulerProcessor>();
        services.AddHostedService<SchedulerBackgroundService>();

        return services;
    }

    private static IServiceCollection AddStorage(this IServiceCollection services)
    {
        services.AddScoped<IImageProvider, CloudinaryImageProvider>();

        return services;
    }
}
