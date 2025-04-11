using Domain.Notes;
using Domain.Users;
using Infrastructure.Authentication;
using Infrastructure.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace Api.Endpoints.Notes.Delete;

public class DeleteNoteEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapDelete("notes/{id:guid}", Handler)
            .WithTags(Tags.Notes)
            .HasPermission(PermissionType.DeleteNote, PermissionType.DeleteOwnNote);
    }

    public static async Task<Results<NoContent, NotFound>> Handler(
        [FromRoute] Guid id,
        UserContext userContext,
        PermissionProvider permissionProvider,
        IMongoCollection<Note> notesCollection,
        CancellationToken cancellationToken)
    {
        List<PermissionType> userPermissions = await permissionProvider.GetPermissionsAsync(userContext.UserId);
        List<FilterDefinition<Note>> filters = [Builders<Note>.Filter.Eq(note => note.Id, id)];

        if (!userPermissions.ContainsPermission(PermissionType.DeleteNote))
        {
            filters.Add(Builders<Note>.Filter.Eq(note => note.CreatedBy, userContext.UserId));
        }

        UpdateDefinition<Note> update = Builders<Note>.Update
            .Set(note => note.DeletedOnUtc, DateTime.UtcNow)
            .Set(note => note.DeletedBy, userContext.UserId);

        UpdateResult updateResult = await notesCollection
            .UpdateOneAsync(
                Builders<Note>.Filter.And(filters),
                update,
                null,
                cancellationToken);

        return updateResult.MatchedCount > 0 ? TypedResults.NoContent() : TypedResults.NotFound();
    }
}
