using Api.Endpoints;
using Domain.Notes;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace Api.Features.Notes.RestoreById;

public class RestoreNoteByIdEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPatch("notes/restore/{id:guid}", Handler)
            .WithTags(EndpointTags.Notes);
    }

    public static async Task<Results<NoContent, NotFound>> Handler(
        [FromRoute] Guid id,
        IMongoCollection<Note> notesCollection,
        CancellationToken cancellationToken)
    {
        FilterDefinition<Note> filter = Builders<Note>.Filter.Eq(note => note.Id, id);

        UpdateDefinition<Note> update = Builders<Note>.Update
            .Set(note => note.DeletedAt, null)
            .Set(note => note.DeletedBy, null);

        UpdateResult updateResult = await notesCollection
            .UpdateOneAsync(
                filter,
                update,
                null,
                cancellationToken);

        return updateResult.ModifiedCount > 0 ? TypedResults.NoContent() : TypedResults.NotFound();
    }
}
