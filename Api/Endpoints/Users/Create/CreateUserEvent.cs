using Api.Events;

namespace Api.Endpoints.Users.Create;

public record CreateUserEvent(Guid UserId) : IEvent;
