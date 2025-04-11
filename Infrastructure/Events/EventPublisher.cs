using System.Collections.Concurrent;
using System.Reflection;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure.Events;

public class EventPublisher : IEventPublisher
{
    private static readonly ConcurrentDictionary<Type, MethodInfo> PublishGenericMethodCache = new();
    private static readonly MethodInfo PublishGenericMethod = typeof(EventPublisher)
        .GetMethods()
        .First(method => method.IsGenericMethod && method.Name == nameof(Publish));

    private readonly IServiceProvider _serviceProvider;

    public EventPublisher(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public Task Publish(object message, CancellationToken cancellationToken = default) =>
        message switch
        {
            null => throw new ArgumentNullException(nameof(message)),
            IEvent instance => InvokePublishGenericMethod(instance, cancellationToken),
            _ => throw new ArgumentException($"{nameof(message)} does not implement ${nameof(IEvent)}")
        };

    public Task Publish<TEvent>(TEvent message, CancellationToken cancellationToken = default)
        where TEvent : notnull, IEvent
    {
        IEnumerable<IEventHandler<TEvent>> eventHandlers = _serviceProvider
            .GetServices<IEventHandler<TEvent>>();

        IEnumerable<Task> eventTasks = eventHandlers
            .Select(eventHandler => eventHandler.Handle(message, cancellationToken));

        return Task.WhenAll(eventTasks);
    }

    private Task InvokePublishGenericMethod(IEvent message, CancellationToken cancellationToken)
    {
        return (Task)GetOrAddPublishGenericMethod(message.GetType())
            .Invoke(this, [message, cancellationToken])!;
    }

    private static MethodInfo GetOrAddPublishGenericMethod(Type messageType)
    {
        return PublishGenericMethodCache.GetOrAdd(
            messageType,
            PublishGenericMethod.MakeGenericMethod(messageType));
    }
}
