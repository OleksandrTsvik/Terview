using Api.Endpoints;
using Api.Extensions;
using Domain.Notes;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using SharedKernel;

namespace Api.Features.Notes.Get;

public class GetNotesEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("notes", Handler)
            .WithTags(EndpointTags.Notes);
    }

    public static async Task<Ok<PagedList<NoteResponse>>> Handler(
        [FromQuery(Name = "q")] string? query,
        [FromQuery(Name = "t")] string[]? tags,
        [FromQuery(Name = "p")] int? pageNumber,
        [FromQuery(Name = "ps")] int? pageSize,
        IMongoCollection<Note> notesCollection,
        CancellationToken cancellationToken)
    {
        PagedList<NoteResponse> notes = await notesCollection.AsQueryable()
            .WhereIf(
                !string.IsNullOrWhiteSpace(query),
                note => note.Title.Contains(query!) || note.Content.Contains(query!))
            .WhereIf(
                tags?.Length > 0,
                note => tags!.All(tag => note.Tags.Contains(tag)))
            .Select(note => new NoteResponse
            {
                Id = note.Id,
                Title = note.Title,
                Content = note.Content,
                Tags = note.Tags,
                CreatedAt = note.CreatedAt,
                UpdatedAt = note.UpdatedAt,
            })
            .ToPagedListAsync(pageNumber, pageSize, cancellationToken);

        return TypedResults.Ok(notes);
    }
}
