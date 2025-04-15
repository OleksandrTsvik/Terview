using Domain.Users;
using HealthChecks.Network.Core;
using HealthChecks.UI.Client;
using Infrastructure.Authorization;
using Infrastructure.Options;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace Infrastructure.Health;

public static class HealthExtensions
{
    public static IServiceCollection AddHealth(this IServiceCollection services, ConfigurationManager configuration)
    {
        EmailOptions emailOptions = configuration
            .GetSection(EmailOptions.ConfigurationSectionName)
            .Get<EmailOptions>()!;

        services.AddHealthChecks()
            .AddCheck<LoggerHealthCheck>("Logger", HealthStatus.Unhealthy)
            .AddCheck<CloudinaryHealthCheck>("Cloudinary", HealthStatus.Unhealthy)
            .AddMongoDb()
            .AddSmtpHealthCheck(setup =>
            {
                setup.Host = emailOptions.Host;
                setup.Port = emailOptions.Port;
                setup.ConnectionType = SmtpConnectionType.TLS;
            }, "SmtpEmail");

        return services;
    }

    public static IApplicationBuilder MapHealthChecks(
        this WebApplication app,
        string pattern,
        RouteGroupBuilder? routeGroupBuilder = null)
    {
        IEndpointRouteBuilder builder = routeGroupBuilder is null ? app : routeGroupBuilder;

        builder.MapHealthChecks(
            pattern,
            new HealthCheckOptions
            {
                ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse,
            })
            .RequireAuthorization(new HasPermissionAttribute(PermissionType.HealthChecks));

        return app;
    }
}
