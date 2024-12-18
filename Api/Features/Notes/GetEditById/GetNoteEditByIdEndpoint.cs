using Api.Endpoints;
using Domain.Notes;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace Api.Features.Notes.GetEditById;

public class GetNoteEditByIdEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("notes/edit/{id:guid}", Handler)
            .WithTags(EndpointTags.Notes);
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
                CreatedAt = note.CreatedAt,
                CreatedBy = note.CreatedBy,
                UpdatedAt = note.UpdatedAt,
                UpdatedBy = note.UpdatedBy,
                DeletedAt = note.DeletedAt,
                DeletedBy = note.DeletedBy
            })
            .FirstOrDefaultAsync(cancellationToken);

        return note is not null ? TypedResults.Ok(note) : TypedResults.NotFound();
    }
}
