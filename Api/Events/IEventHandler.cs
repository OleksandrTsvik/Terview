namespace Api.Events;

public interface IEventHandler<TEvent>
    where TEvent : notnull, IEvent
{
    Task Handle(TEvent message, CancellationToken cancellationToken = default);
}
