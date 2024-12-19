using Domain.Notes;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace Api.Endpoints.Notes.GetEditById;

public class GetNoteEditByIdEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("notes/edit/{id:guid}", Handler)
            .WithTags(Tags.Notes)
            .RequireAuthorization();
    }

    public static async Task<Results<Ok<NoteResponse>, NotFound>> Handler(
        [FromRoute] Guid id,
        IMongoCollection<Note> notesCollection,
        CancellationToken cancellationToken)
    {
        NoteResponse? note = await notesCollection
            .Find(note => note.Id == id)
            .Project(note => new NoteResponse
            {
                Id = note.Id,
                Title = note.Title,
                Content = note.Content,
                Tags = note.Tags,
                CreatedOnUtc = note.CreatedOnUtc,
                CreatedBy = note.CreatedBy,
                UpdatedOnUtc = note.UpdatedOnUtc,
                UpdatedBy = note.UpdatedBy,
                DeletedOnUtc = note.DeletedOnUtc,
                DeletedBy = note.DeletedBy
            })
            .FirstOrDefaultAsync(cancellationToken);

        return note is not null ? TypedResults.Ok(note) : TypedResults.NotFound();
    }
}
