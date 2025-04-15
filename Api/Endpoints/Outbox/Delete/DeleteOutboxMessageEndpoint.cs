using Domain.Users;
using Infrastructure.Outbox;
using Microsoft.AspNetCore.Http.HttpResults;
using MongoDB.Driver;

namespace Api.Endpoints.Outbox.Delete;

public class DeleteOutboxMessageEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapDelete("outbox/{id:guid}", Handler)
            .WithTags(Tags.Outbox)
            .HasPermission(PermissionType.DeleteOutboxMessage);
    }

    public static async Task<Results<NoContent, NotFound>> Handler(
        Guid id,
        IMongoCollection<OutboxMessage> outboxMessagesCollection,
        CancellationToken cancellationToken)
    {
        DeleteResult deleteResult = await outboxMessagesCollection.DeleteOneAsync(
            outboxMessage => outboxMessage.Id == id,
            cancellationToken);

        return deleteResult.DeletedCount > 0 ? TypedResults.NoContent() : TypedResults.NotFound();
    }
}
