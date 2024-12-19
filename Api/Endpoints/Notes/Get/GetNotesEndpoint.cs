using Api.Extensions;
using Domain.Notes;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using SharedKernel;

namespace Api.Endpoints.Notes.Get;

public class GetNotesEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("notes", Handler)
            .WithTags(Tags.Notes);
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
            .Where(note => note.DeletedAt == null && note.DeletedBy == null)
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
            .OrderByDescending(note => note.UpdatedAt)
            .ThenByDescending(note => note.CreatedAt)
            .ToPagedListAsync(pageNumber, pageSize, cancellationToken);

        return TypedResults.Ok(notes);
    }
}
