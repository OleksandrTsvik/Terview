using Api.Options;
using Microsoft.Extensions.Options;

namespace Api.Outbox;

public class OutboxBackgroundService : BackgroundService
{
    private readonly TimeSpan _period;
    private readonly IServiceScopeFactory _serviceScopeFactory;
    private readonly ILogger<OutboxBackgroundService> _logger;

    public OutboxBackgroundService(
        IOptions<OutboxOptions> outboxOptions,
        IServiceScopeFactory serviceScopeFactory,
        ILogger<OutboxBackgroundService> logger)
    {
        _period = TimeSpan.FromSeconds(outboxOptions.Value.PeriodInSeconds);
        _serviceScopeFactory = serviceScopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation($"Starting {nameof(OutboxBackgroundService)} ...");

        // Required for the method to be executed asynchronously, allowing startup to continue.
        await Task.Yield();

        try
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                using IServiceScope scope = _serviceScopeFactory.CreateScope();
                OutboxProcessor outboxProcessor = scope.ServiceProvider.GetRequiredService<OutboxProcessor>();

                await outboxProcessor.Execute(stoppingToken);

                await Task.Delay(_period, stoppingToken);
            }
        }
        catch (OperationCanceledException)
        {
            _logger.LogInformation($"{nameof(OutboxBackgroundService)} cancelled.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"An error occurred in {nameof(OutboxBackgroundService)}.");
        }
        finally
        {
            _logger.LogInformation($"{nameof(OutboxBackgroundService)} finished ...");
        }
    }
}
