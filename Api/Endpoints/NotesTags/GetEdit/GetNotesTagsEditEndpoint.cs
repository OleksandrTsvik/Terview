using Api.Extensions;
using Domain.Notes;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using SharedKernel;

namespace Api.Endpoints.NotesTags.GetEdit;

public class GetNotesTagsEditEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("notes/tags/edit", Handler)
            .WithTags(Tags.NotesTags)
            .RequireAuthorization();
    }

    public static async Task<Ok<PagedList<string>>> Handler(
        [FromQuery(Name = "q")] string? query,
        [FromQuery(Name = "p")] int? pageNumber,
        [FromQuery(Name = "ps")] int? pageSize,
        IMongoCollection<Note> notesCollection,
        CancellationToken cancellationToken)
    {
        PagedList<string> tags = await notesCollection.AsQueryable()
            .SelectMany(note => note.Tags)
            .WhereIf(
                !string.IsNullOrWhiteSpace(query),
                tag => tag.ToLower().Contains(query!.ToLower()))
            .Distinct()
            .OrderBy(tag => tag)
            .ToPagedListAsync(pageNumber, pageSize, cancellationToken);

        return TypedResults.Ok(tags);
    }
}
