using Domain.Notes;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using MongoDB.Driver.Linq;

namespace Api.Endpoints.Notes.GetBySlug;

public class GetNoteBySlugEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("notes/slug/{slug}", Handler)
            .WithTags(Tags.Notes);
    }

    public static async Task<Results<Ok<NoteResponse>, NotFound>> Handler(
        [FromRoute] string slug,
        IMongoCollection<Note> notesCollection,
        CancellationToken cancellationToken)
    {
        NoteResponse? note = await notesCollection.AsQueryable()
            .Where(note => note.Slug.ToLower() == slug.ToLower())
            .Select(note => new NoteResponse
            {
                Id = note.Id,
                Slug = note.Slug,
                Title = note.Title,
                Content = note.Content,
                Tags = note.Tags.OrderBy(tag => tag).ToList(),
                CreatedOnUtc = note.CreatedOnUtc,
                UpdatedOnUtc = note.UpdatedOnUtc,
            })
            .FirstOrDefaultAsync(cancellationToken);

        return note is not null ? TypedResults.Ok(note) : TypedResults.NotFound();
    }
}
