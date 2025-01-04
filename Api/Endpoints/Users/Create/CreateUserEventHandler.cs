using Api.Events;

namespace Api.Endpoints.Users.Create;

public class CreateUserEventHandler : IEventHandler<CreateUserEvent>
{
    public Task Handle(CreateUserEvent message, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }
}
