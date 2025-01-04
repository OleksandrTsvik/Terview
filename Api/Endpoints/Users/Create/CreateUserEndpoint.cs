using Api.Events;
using Api.Extensions;
using Domain.Users;
using Microsoft.AspNetCore.Http.HttpResults;
using MongoDB.Driver;

namespace Api.Endpoints.Users.Create;

public class CreateUserEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("users", Handler)
            .WithRequestValidation<CreateUserRequest>()
            .WithTags(Tags.Users)
            .RequireAuthorization();
    }

    public static async Task<NoContent> Handler(
        CreateUserRequest request,
        IMongoCollection<User> usersCollection,
        IEventBus eventBus,
        CancellationToken cancellationToken)
    {
        var user = new User
        {
            Email = request.Email
        };

        await usersCollection.InsertOneAsync(user, null, cancellationToken);

        await eventBus.Send(new CreateUserEvent(user.Id), cancellationToken);

        return TypedResults.NoContent();
    }
}
