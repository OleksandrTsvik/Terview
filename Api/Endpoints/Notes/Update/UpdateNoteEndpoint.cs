using Domain.Notes;
using Domain.Users;
using Infrastructure.Authentication;
using Infrastructure.Authorization;
using Infrastructure.Events;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace Api.Endpoints.Notes.Update;

public class UpdateNoteEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPut("notes/{id:guid}", Handler)
            .WithRequestValidation<UpdateNoteRequest>()
            .WithTags(Tags.Notes)
            .HasPermission(PermissionType.UpdateNote, PermissionType.UpdateOwnNote);
    }

    public static async Task<Results<NoContent, NotFound, BadRequest<string>>> Handler(
        [FromRoute] Guid id,
        UpdateNoteRequest request,
        UserContext userContext,
        IMongoCollection<Note> notesCollection,
        IEventBus eventBus,
        CancellationToken cancellationToken)
    {
        Note? note = await GetNoteAsync(id, userContext, notesCollection, cancellationToken);

        if (note is null)
        {
            return TypedResults.NotFound();
        }

        if (!await IsSlugUniqueAsync(request.Slug, note.Slug, notesCollection, cancellationToken))
        {
            return TypedResults.BadRequest("The slug must be unique.");
        }

        await UpdateNoteAsync(id, request, userContext, notesCollection, cancellationToken);

        await eventBus.Send(new UpdateNoteEvent(id), cancellationToken);

        return TypedResults.NoContent();
    }

    private static async Task<Note?> GetNoteAsync(
        Guid id,
        UserContext userContext,
        IMongoCollection<Note> notesCollection,
        CancellationToken cancellationToken)
    {
        List<PermissionType> userPermissions = await userContext.GetUserPermissionsAsync();

        FilterDefinitionBuilder<Note> filterBuilder = Builders<Note>.Filter;
        List<FilterDefinition<Note>> filters =
        [
            filterBuilder.Eq(note => note.Id, id),
            filterBuilder.Eq(note => note.DeletedOnUtc, null),
            filterBuilder.Eq(note => note.DeletedBy, null)
        ];

        if (!userPermissions.ContainsPermission(PermissionType.UpdateNote))
        {
            filters.Add(filterBuilder.Eq(note => note.CreatedBy, userContext.UserId));
        }

        Note? note = await notesCollection
            .Find(filterBuilder.And(filters))
            .FirstOrDefaultAsync(cancellationToken);

        return note;
    }

    private static async Task<bool> IsSlugUniqueAsync(
        string newSlug,
        string oldSlug,
        IMongoCollection<Note> notesCollection,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(newSlug))
        {
            return false;
        }

        if (oldSlug == newSlug)
        {
            return true;
        }

        return !await notesCollection.Find(note => note.Slug == newSlug).AnyAsync(cancellationToken);
    }

    private static async Task UpdateNoteAsync(
        Guid id,
        UpdateNoteRequest request,
        UserContext userContext,
        IMongoCollection<Note> notesCollection,
        CancellationToken cancellationToken)
    {
        FilterDefinition<Note> filter = Builders<Note>.Filter.Eq(note => note.Id, id);

        List<string> tags = request.Tags?
            .Where(tag => !string.IsNullOrWhiteSpace(tag))
            .Select(tag => tag.Trim())
            .Distinct()
            .ToList() ?? [];

        UpdateDefinition<Note> update = Builders<Note>.Update
            .Set(note => note.Slug, request.Slug)
            .Set(note => note.Title, request.Title)
            .Set(note => note.Content, request.Content)
            .Set(note => note.Tags, tags)
            .Set(note => note.UpdatedOnUtc, DateTime.UtcNow)
            .Set(note => note.UpdatedBy, userContext.UserId);

        await notesCollection.UpdateOneAsync(
            filter,
            update,
            null,
            cancellationToken);
    }
}
