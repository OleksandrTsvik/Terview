using Domain.Notes;
using Domain.Users;
using Infrastructure.Authentication;
using Infrastructure.Authorization;
using Infrastructure.Database;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using MongoDB.Driver.Linq;

namespace Api.Endpoints.Notes.GetEditById;

public class GetNoteEditByIdEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("notes/edit/{id:guid}", Handler)
            .WithTags(Tags.Notes)
            .HasPermission(PermissionType.ReadNote, PermissionType.ReadOwnNote);
    }

    public static async Task<Results<Ok<NoteResponse>, NotFound>> Handler(
        [FromRoute] Guid id,
        UserContext userContext,
        PermissionProvider permissionProvider,
        IMongoCollection<Note> notesCollection,
        CancellationToken cancellationToken)
    {
        List<PermissionType> userPermissions = await permissionProvider.GetPermissionsAsync(userContext.UserId);

        NoteResponse? note = await notesCollection.AsQueryable()
            .Where(note => note.Id == id)
            .WhereIf(
                !userPermissions.ContainsPermission(PermissionType.ReadNote),
                note => note.CreatedBy == userContext.UserId)
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
            .FirstOrDefaultAsync(cancellationToken);

        return note is not null ? TypedResults.Ok(note) : TypedResults.NotFound();
    }
}
