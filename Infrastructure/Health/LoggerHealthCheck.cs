using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Health;

public class LoggerHealthCheck : IHealthCheck
{
    private readonly ILogger<LoggerHealthCheck> _logger;

    public LoggerHealthCheck(ILogger<LoggerHealthCheck> logger)
    {
        _logger = logger;
    }

    public Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("HealthCheck: LogInformation.");
            _logger.LogDebug("HealthCheck: LogDebug.");
            _logger.LogWarning("HealthCheck: LogWarning.");
            _logger.LogError("HealthCheck: LogError.");
            _logger.LogCritical("HealthCheck: LogCritical.");
            _logger.LogTrace("HealthCheck: LogTrace.");

            return Task.FromResult(HealthCheckResult.Healthy());
        }
        catch (Exception ex)
        {
            return Task.FromResult(HealthCheckResult.Unhealthy(exception: ex));
        }
    }
}
