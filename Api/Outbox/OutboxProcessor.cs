using System.Collections.Concurrent;
using System.Text.Json;
using Api.Events;
using Api.Options;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using MongoDB.Driver.Linq;

namespace Api.Outbox;

public class OutboxProcessor
{
    private static readonly ConcurrentDictionary<string, Type?> MessageTypeCache = new();

    private readonly int _batchSize;
    private readonly IMongoCollection<OutboxMessage> _outboxMessagesCollection;
    private readonly IEventPublisher _eventPublisher;
    private readonly ILogger<OutboxProcessor> _logger;

    public OutboxProcessor(
        IOptions<OutboxOptions> outboxOptions,
        IMongoCollection<OutboxMessage> outboxMessagesCollection,
        IEventPublisher eventPublisher,
        ILogger<OutboxProcessor> logger)
    {
        _batchSize = outboxOptions.Value.BatchSize;
        _outboxMessagesCollection = outboxMessagesCollection;
        _eventPublisher = eventPublisher;
        _logger = logger;
    }

    public async Task Execute(CancellationToken cancellationToken = default)
    {
        List<OutboxMessage> messages = await _outboxMessagesCollection.AsQueryable()
            .Where(message => message.ProcessedOnUtc == null)
            .OrderBy(message => message.OccurredOnUtc)
            .Take(_batchSize)
            .ToListAsync(cancellationToken);

        if (messages.Count == 0)
        {
            return;
        }

        var publishTasks = messages
            .Select(message => PublishMessageAsync(message, cancellationToken))
            .ToList();

        OutboxUpdate[] outboxUpdates = await Task.WhenAll(publishTasks);

        await UpdateOutboxMessagesAsync(outboxUpdates, cancellationToken);
    }

    private async Task<OutboxUpdate> PublishMessageAsync(
        OutboxMessage message,
        CancellationToken cancellationToken)
    {
        try
        {
            Type? messageType = GetOrAddMessageType(message.Type);

            if (messageType is null)
            {
                _logger.LogError("Invalid message type: {MessageType}", message.Type);
                return CreateOutboxUpdate(message, "Invalid message type.");
            }

            object? deserializedMessage = JsonSerializer.Deserialize(message.Content, messageType);

            if (deserializedMessage is null)
            {
                _logger.LogError("Invalid message content: {MessageContent}", message.Content);
                return CreateOutboxUpdate(message, "Invalid message content.");
            }

            await _eventPublisher.Publish(deserializedMessage, cancellationToken);

            return CreateOutboxUpdate(message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"An error occurred in {nameof(OutboxProcessor)}.");
            return CreateOutboxUpdate(message, ex.ToString());
        }
    }

    private static Type? GetOrAddMessageType(string messageType)
    {
        return MessageTypeCache.GetOrAdd(
            messageType,
            typename => AssemblyReference.Assembly.GetType(typename));
    }

    private static OutboxUpdate CreateOutboxUpdate(OutboxMessage message, string? error = null)
    {
        return new OutboxUpdate
        {
            Id = message.Id,
            ProcessedOnUtc = DateTime.UtcNow,
            Error = error
        };
    }

    private async Task UpdateOutboxMessagesAsync(
        IEnumerable<OutboxUpdate> outboxUpdates,
        CancellationToken cancellationToken)
    {
        var requests = outboxUpdates
            .Select(update => new UpdateOneModel<OutboxMessage>(
                Builders<OutboxMessage>.Filter.Eq(message => message.Id, update.Id),
                Builders<OutboxMessage>.Update
                    .Set(message => message.ProcessedOnUtc, update.ProcessedOnUtc)
                    .Set(message => message.Error, update.Error)))
            .ToList();

        await _outboxMessagesCollection.BulkWriteAsync(requests, null, cancellationToken);
    }

    private readonly struct OutboxUpdate
    {
        public Guid Id { get; init; }
        public DateTime ProcessedOnUtc { get; init; }
        public string? Error { get; init; }
    }
}
