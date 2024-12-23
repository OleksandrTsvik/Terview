namespace Api.Events;

public interface IEventBus
{
    Task Send<TEvent>(TEvent message, CancellationToken cancellationToken = default)
        where TEvent : notnull, IEvent;
}
