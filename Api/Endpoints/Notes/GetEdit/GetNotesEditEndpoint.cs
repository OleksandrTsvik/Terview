using Api.Extensions;
using Domain.Notes;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using SharedKernel;

namespace Api.Endpoints.Notes.GetEdit;

public class GetNotesEditEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("notes/edit", Handler)
            .WithTags(Tags.Notes)
            .RequireAuthorization();
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
                CreatedBy = note.CreatedBy,
                UpdatedAt = note.UpdatedAt,
                UpdatedBy = note.UpdatedBy,
                DeletedAt = note.DeletedAt,
                DeletedBy = note.DeletedBy
            })
            .OrderBy(note => note.DeletedAt)
            .ThenByDescending(note => note.UpdatedAt)
            .ThenByDescending(note => note.CreatedAt)
            .ToPagedListAsync(pageNumber, pageSize, cancellationToken);

        return TypedResults.Ok(notes);
    }
}
