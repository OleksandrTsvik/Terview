using Api.Endpoints;
using Domain.Notes;
using Microsoft.AspNetCore.Http.HttpResults;
using MongoDB.Driver;
using MongoDB.Driver.Linq;

namespace Api.Features.Notes.GetTags;

public class GetNotesTagsEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("notes/tags", Handler)
            .WithTags(EndpointTags.Notes);
    }

    public static async Task<Ok<List<string>>> Handler(
        IMongoCollection<Note> notesCollection,
        CancellationToken cancellationToken)
    {
        List<string> tags = await notesCollection.AsQueryable()
            .SelectMany(note => note.Tags)
            .Distinct()
            .OrderBy(tag => tag)
            .ToListAsync(cancellationToken);

        return TypedResults.Ok(tags);
    }
}

