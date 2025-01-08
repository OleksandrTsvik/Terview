using Api.Extensions;
using Api.Outbox;
using Domain.Users;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using SharedKernel;

namespace Api.Endpoints.Outbox.Get;

public class GetOutboxMessagesEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("outbox", Handler)
            .WithTags(Tags.Outbox)
            .HasPermission(PermissionType.ReadOutboxMessage);
    }

    public static async Task<Ok<PagedList<OutboxResponse>>> Handler(
        [FromQuery(Name = "p")] int? pageNumber,
        [FromQuery(Name = "ps")] int? pageSize,
        IMongoCollection<OutboxMessage> outboxMessagesCollection,
        CancellationToken cancellationToken)
    {
        PagedList<OutboxResponse> outboxMessages = await outboxMessagesCollection.AsQueryable()
            .Select(outboxMessage => new OutboxResponse
            {
                Id = outboxMessage.Id,
                Type = outboxMessage.Type,
                Content = outboxMessage.Content,
                OccurredOnUtc = outboxMessage.OccurredOnUtc,
                ProcessedOnUtc = outboxMessage.ProcessedOnUtc,
                Error = outboxMessage.Error,
            })
            .OrderByDescending(outboxMessage => outboxMessage.OccurredOnUtc)
            .ToPagedListAsync(pageNumber, pageSize, cancellationToken);

        return TypedResults.Ok(outboxMessages);
    }
}
