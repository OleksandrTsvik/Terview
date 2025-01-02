using Api.Authentication;
using Api.Endpoints.Notes.Create;
using Api.Events;
using Api.Extensions;
using Domain.Notes;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace Api.Endpoints.Notes.Update;

public class UpdateNoteEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPut("notes/{id:guid}", Handler)
            .WithRequestValidation<UpdateNoteRequest>()
            .WithTags(Tags.Notes)
            .RequireAuthorization();
    }

    public static async Task<Results<NoContent, NotFound>> Handler(
        [FromRoute] Guid id,
        CreateNoteRequest request,
        UserContext userContext,
        IMongoCollection<Note> notesCollection,
        IEventBus eventBus,
        CancellationToken cancellationToken)
    {
        List<string> tags = request.Tags?
            .Where(tag => !string.IsNullOrWhiteSpace(tag))
            .Select(tag => tag.Trim())
            .Distinct()
            .ToList() ?? [];

        FilterDefinitionBuilder<Note> filterBuilder = Builders<Note>.Filter;
        FilterDefinition<Note> filter = filterBuilder.And(
            filterBuilder.Eq(note => note.Id, id),
            filterBuilder.Eq(note => note.DeletedOnUtc, null),
            filterBuilder.Eq(note => note.DeletedBy, null));

        UpdateDefinition<Note> update = Builders<Note>.Update
            .Set(note => note.Title, request.Title)
            .Set(note => note.Content, request.Content)
            .Set(note => note.Tags, tags)
            .Set(note => note.UpdatedOnUtc, DateTime.UtcNow)
            .Set(note => note.UpdatedBy, userContext.UserId);

        UpdateResult updateResult = await notesCollection
            .UpdateOneAsync(
                filter,
                update,
                null,
                cancellationToken);

        if (updateResult.MatchedCount == 0)
        {
            return TypedResults.NotFound();
        }

        await eventBus.Send(new UpdateNoteEvent(id), cancellationToken);

        return TypedResults.NoContent();
    }
}
