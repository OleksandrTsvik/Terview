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
        [FromQuery(Name = "s")] string? sort,
        [FromQuery(Name = "p")] int? pageNumber,
        [FromQuery(Name = "ps")] int? pageSize,
        IMongoCollection<Note> notesCollection,
        CancellationToken cancellationToken)
    {
        NoteSortType sortType = sort.GetNoteSortType();

        PagedList<NoteResponse> notes = await notesCollection.AsQueryable()
            .Where(note => note.DeletedOnUtc == null && note.DeletedBy == null)
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
                UpdatedOnUtc = note.UpdatedOnUtc,
            })
            .QueryIf(
                sortType == NoteSortType.Alphabet,
                query => query.OrderBy(note => note.Title))
            .QueryIf(
                sortType == NoteSortType.Date,
                query => query.OrderByDescending(note =>
                    note.UpdatedOnUtc > note.CreatedOnUtc ? note.UpdatedOnUtc : note.CreatedOnUtc))
            .ToPagedListAsync(pageNumber, pageSize, cancellationToken);

        return TypedResults.Ok(notes);
    }
}
