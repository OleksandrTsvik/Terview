using Api.Extensions;
using Domain.Notes;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
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
        [FromQuery(Name = "t")] string[]? selectedTags,
        IMongoCollection<Note> notesCollection,
        CancellationToken cancellationToken)
    {
        List<string> tags = await notesCollection.AsQueryable()
            .Where(note => note.DeletedOnUtc == null && note.DeletedBy == null)
            .WhereIf(
                selectedTags?.Length > 0,
                note => selectedTags!.All(tag => note.Tags.Contains(tag)))
            .SelectMany(note => note.Tags)
            .Distinct()
            .OrderBy(tag => tag)
            .ToListAsync(cancellationToken);

        if (selectedTags?.Length > 0)
        {
            tags.AddRange(selectedTags.Except(tags));
        }

        return TypedResults.Ok(tags);
    }
}

