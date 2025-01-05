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
        [FromQuery(Name = "s")] string? sort,
        [FromQuery(Name = "p")] int? pageNumber,
        [FromQuery(Name = "ps")] int? pageSize,
        IMongoCollection<Note> notesCollection,
        CancellationToken cancellationToken)
    {
        NoteSortType sortType = sort.GetNoteSortType();

        PagedList<NoteResponse> notes = await notesCollection.AsQueryable()
            .WhereIf(
                !string.IsNullOrWhiteSpace(query),
                note =>
                    note.Title.ToLower().Contains(query!.ToLower()) ||
                    note.Content.ToLower().Contains(query!.ToLower()))
            .WhereIf(
                tags?.Length > 0,
                note => tags!.All(tag => note.Tags.Contains(tag)))
            .Select(note => new NoteResponse
            {
                Id = note.Id,
                Title = note.Title,
                Content = note.Content,
                Tags = note.Tags.OrderBy(tag => tag).ToList(),
                CreatedOnUtc = note.CreatedOnUtc,
                CreatedBy = note.CreatedBy,
                UpdatedOnUtc = note.UpdatedOnUtc,
                UpdatedBy = note.UpdatedBy,
                DeletedOnUtc = note.DeletedOnUtc,
                DeletedBy = note.DeletedBy
            })
            .OrderBy(note => note.DeletedOnUtc)
            .QueryIf(
                sortType == NoteSortType.Alphabet,
                query => query.ThenBy(note => note.Title))
            .QueryIf(
                sortType == NoteSortType.Date,
                query => query
                    .ThenByDescending(note => note.UpdatedOnUtc)
                    .ThenByDescending(note => note.CreatedOnUtc))
            .ToPagedListAsync(pageNumber, pageSize, cancellationToken);

        return TypedResults.Ok(notes);
    }
}
