using System.Text.Json;
using Api.Outbox;
using MongoDB.Driver;

namespace Api.Events;

public class EventBus : IEventBus
{
    private readonly IMongoCollection<OutboxMessage> _outboxMessagesCollection;
    private readonly ILogger<EventBus> _logger;

    public EventBus(
        IMongoCollection<OutboxMessage> outboxMessagesCollection,
        ILogger<EventBus> logger)
    {
        _outboxMessagesCollection = outboxMessagesCollection;
        _logger = logger;
    }

    public async Task Send<TEvent>(TEvent message, CancellationToken cancellationToken)
        where TEvent : notnull, IEvent
    {
        try
        {
            string? messageType = message.GetType().FullName;

            if (messageType is null)
            {
                _logger.LogError("Invalid message type: {@MessageType}", message.GetType());
                return;
            }

            string messageContent = JsonSerializer.Serialize(message);

            var outboxMessage = new OutboxMessage
            {
                Type = messageType,
                Content = messageContent,
                OccurredOnUtc = DateTime.UtcNow
            };

            await _outboxMessagesCollection.InsertOneAsync(outboxMessage, null, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"An error occurred in {nameof(EventBus)}.");
        }
    }
}
