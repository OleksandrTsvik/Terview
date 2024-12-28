using Domain.Notes;
using Microsoft.AspNetCore.Http.HttpResults;
using MongoDB.Driver;
using MongoDB.Driver.Linq;

namespace Api.Endpoints.NotesTags.Get;

public class GetNotesTagsEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("notes/tags", Handler)
            .WithTags(Tags.NotesTags);
    }

    public static async Task<Ok<List<string>>> Handler(
        IMongoCollection<Note> notesCollection,
        CancellationToken cancellationToken)
    {
        List<string> tags = await notesCollection.AsQueryable()
            .Where(note => note.DeletedOnUtc == null && note.DeletedBy == null)
            .SelectMany(note => note.Tags)
            .Distinct()
            .OrderBy(tag => tag)
            .ToListAsync(cancellationToken);

        return TypedResults.Ok(tags);
    }
}

