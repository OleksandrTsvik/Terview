using Api.Options;
using Api.Outbox;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace Api.Jobs;

public class DeleteProcessedOutboxMessagesJob : IJob
{
    private readonly int _afterDays;
    private readonly IMongoCollection<OutboxMessage> _outboxMessagesCollection;

    public DeleteProcessedOutboxMessagesJob(
        IOptions<JobsOptions> jobsOptions,
        IMongoCollection<OutboxMessage> outboxMessagesCollection)
    {
        _afterDays = jobsOptions.Value.DeleteProcessedOutboxMessagesAfterDays;
        _outboxMessagesCollection = outboxMessagesCollection;
    }

    public async Task Run(CancellationToken cancellationToken = default)
    {
        await _outboxMessagesCollection.DeleteManyAsync(
            outboxMessage =>
                outboxMessage.Error == null &&
                outboxMessage.ProcessedOnUtc.HasValue &&
                outboxMessage.ProcessedOnUtc.Value.AddDays(_afterDays) < DateTime.UtcNow,
            cancellationToken);
    }
}
