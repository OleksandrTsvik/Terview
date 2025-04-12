using Domain.Notes;
using Domain.Users;
using Infrastructure.Authentication;
using Infrastructure.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace Api.Endpoints.Notes.RestoreById;

public class RestoreNoteByIdEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPatch("notes/restore/{id:guid}", Handler)
            .WithTags(Tags.Notes)
            .HasPermission(PermissionType.RestoreNote, PermissionType.RestoreOwnNote);
    }

    public static async Task<Results<NoContent, NotFound>> Handler(
        [FromRoute] Guid id,
        UserContext userContext,
        IMongoCollection<Note> notesCollection,
        CancellationToken cancellationToken)
    {
        List<PermissionType> userPermissions = await userContext.GetUserPermissionsAsync();
        List<FilterDefinition<Note>> filters = [Builders<Note>.Filter.Eq(note => note.Id, id)];

        if (!userPermissions.ContainsPermission(PermissionType.RestoreNote))
        {
            filters.Add(Builders<Note>.Filter.Eq(note => note.CreatedBy, userContext.UserId));
        }

        UpdateDefinition<Note> update = Builders<Note>.Update
            .Set(note => note.DeletedOnUtc, null)
            .Set(note => note.DeletedBy, null);

        UpdateResult updateResult = await notesCollection
            .UpdateOneAsync(
                Builders<Note>.Filter.And(filters),
                update,
                null,
                cancellationToken);

        return updateResult.MatchedCount > 0 ? TypedResults.NoContent() : TypedResults.NotFound();
    }
}
