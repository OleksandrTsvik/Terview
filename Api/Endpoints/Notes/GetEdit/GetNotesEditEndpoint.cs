using Api.Extensions;
using Domain.Notes;
using Domain.Users;
using Infrastructure.Authentication;
using Infrastructure.Authorization;
using Infrastructure.Database;
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
            .HasPermission(PermissionType.ReadNote, PermissionType.ReadOwnNote);
    }

    public static async Task<Ok<PagedList<NoteResponse>>> Handler(
        [FromQuery(Name = "q")] string? query,
        [FromQuery(Name = "t")] string[]? tags,
        [FromQuery(Name = "tm")] string? tagSearchMode,
        [FromQuery(Name = "cb")] Guid? createdBy,
        [FromQuery(Name = "s")] string? sort,
        [FromQuery(Name = "p")] int? pageNumber,
        [FromQuery(Name = "ps")] int? pageSize,
        UserContext userContext,
        IMongoCollection<Note> notesCollection,
        CancellationToken cancellationToken)
    {
        NoteSortType sortType = sort.GetNoteSortType();
        NoteTagSearchType tagSearchType = tagSearchMode.GetNoteTagSearchType();
        List<PermissionType> userPermissions = await userContext.GetUserPermissionsAsync();

        PagedList<NoteResponse> notes = await notesCollection.AsQueryable()
            .WhereText(query)
            .WhereIf(
                !userPermissions.ContainsPermission(PermissionType.ReadNote),
                note => note.CreatedBy == userContext.UserId)
            .WhereIf(
                tags?.Length > 0 && tagSearchType == NoteTagSearchType.All,
                note => tags!.All(tag => note.Tags.Contains(tag)))
            .WhereIf(
                tags?.Length > 0 && tagSearchType == NoteTagSearchType.Any,
                note => tags!.Any(tag => note.Tags.Contains(tag)))
            .WhereIf(
                createdBy.HasValue,
                note => note.CreatedBy == createdBy)
            .Select(note => new NoteResponse
            {
                Id = note.Id,
                Slug = note.Slug,
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
                query => query.ThenByDescending(note =>
                    note.UpdatedOnUtc > note.CreatedOnUtc ? note.UpdatedOnUtc : note.CreatedOnUtc))
            .ToPagedListAsync(pageNumber, pageSize, cancellationToken);

        return TypedResults.Ok(notes);
    }
}
