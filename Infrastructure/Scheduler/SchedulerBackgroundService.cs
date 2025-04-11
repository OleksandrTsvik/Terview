using Infrastructure.Options;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Infrastructure.Scheduler;

public class SchedulerBackgroundService : BackgroundService
{
    private readonly TimeSpan _period;
    private readonly IServiceScopeFactory _serviceScopeFactory;
    private readonly ILogger<SchedulerBackgroundService> _logger;

    public SchedulerBackgroundService(
        IOptions<SchedulerOptions> schedulerOptions,
        IServiceScopeFactory serviceScopeFactory,
        ILogger<SchedulerBackgroundService> logger)
    {
        _period = TimeSpan.FromSeconds(schedulerOptions.Value.PeriodInSeconds);
        _serviceScopeFactory = serviceScopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation($"Starting {nameof(SchedulerBackgroundService)} ...");

        using var timer = new PeriodicTimer(_period);

        try
        {
            while (await timer.WaitForNextTickAsync(stoppingToken))
            {
                using IServiceScope scope = _serviceScopeFactory.CreateScope();
                SchedulerProcessor schedulerProcessor = scope.ServiceProvider
                    .GetRequiredService<SchedulerProcessor>();

                await schedulerProcessor.Execute(stoppingToken);
            }
        }
        catch (OperationCanceledException)
        {
            _logger.LogInformation($"{nameof(SchedulerBackgroundService)} cancelled.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"An error occurred in {nameof(SchedulerBackgroundService)}.");
        }
        finally
        {
            _logger.LogInformation($"{nameof(SchedulerBackgroundService)} finished ...");
        }
    }
}
