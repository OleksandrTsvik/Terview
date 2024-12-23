namespace Api.Events;

public interface IEventPublisher
{
    Task Publish(object message, CancellationToken cancellationToken = default);

    Task Publish<TEvent>(TEvent message, CancellationToken cancellationToken = default)
        where TEvent : notnull, IEvent;
}
