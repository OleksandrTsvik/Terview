using Api.Outbox;
using Microsoft.AspNetCore.Http.HttpResults;
using MongoDB.Driver;

namespace Api.Endpoints.Outbox.Run;

public class RunEventEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("outbox/{id:guid}", Handler)
            .WithTags(Tags.Outbox)
            .RequireAuthorization();
    }

    public static async Task<Results<NoContent, NotFound>> Handler(
        Guid id,
        IMongoCollection<OutboxMessage> outboxMessagesCollection,
        CancellationToken cancellationToken)
    {
        UpdateDefinition<OutboxMessage> update = Builders<OutboxMessage>.Update
            .Set(outboxMessage => outboxMessage.OccurredOnUtc, DateTime.UtcNow)
            .Set(outboxMessage => outboxMessage.ProcessedOnUtc, null);

        UpdateResult updateResult = await outboxMessagesCollection.UpdateOneAsync(
            outboxMessage => outboxMessage.Id == id,
            update,
            null,
            cancellationToken);

        return updateResult.MatchedCount > 0 ? TypedResults.NoContent() : TypedResults.NotFound();
    }
}
