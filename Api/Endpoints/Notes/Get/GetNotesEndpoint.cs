using Api.Extensions;
using Domain.Notes;
using Infrastructure.Database;
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
        [FromQuery(Name = "tm")] string? tagSearchMode,
        [FromQuery(Name = "s")] string? sort,
        [FromQuery(Name = "p")] int? pageNumber,
        [FromQuery(Name = "ps")] int? pageSize,
        IMongoCollection<Note> notesCollection,
        CancellationToken cancellationToken)
    {
        NoteSortType sortType = sort.GetNoteSortType();
        NoteTagSearchType tagSearchType = tagSearchMode.GetNoteTagSearchType();

        PagedList<NoteResponse> notes = await notesCollection.AsQueryable()
            .WhereText(query)
            .Where(note => note.DeletedOnUtc == null && note.DeletedBy == null)
            .WhereIf(
                tags?.Length > 0 && tagSearchType == NoteTagSearchType.All,
                note => tags!.All(tag => note.Tags.Contains(tag)))
            .WhereIf(
                tags?.Length > 0 && tagSearchType == NoteTagSearchType.Any,
                note => tags!.Any(tag => note.Tags.Contains(tag)))
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
