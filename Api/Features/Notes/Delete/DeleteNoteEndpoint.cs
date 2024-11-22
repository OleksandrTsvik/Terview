using Api.Endpoints;
using Domain.Notes;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace Api.Features.Notes.Delete;

public class DeleteNoteEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapDelete("notes/{id:guid}", Handler)
            .WithTags(EndpointTags.Notes);
    }

    public static async Task<Results<Ok, NotFound>> Handler(
        [FromRoute] Guid id,
        IMongoCollection<Note> notesCollection,
        CancellationToken cancellationToken)
    {
        DeleteResult deleteResult = await notesCollection
            .DeleteOneAsync(note => note.Id == id, cancellationToken);

        return deleteResult.DeletedCount > 0 ? TypedResults.Ok() : TypedResults.NotFound();
    }
}
