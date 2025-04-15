using Domain;
using Domain.Notes;
using Domain.Users;
using Infrastructure.Authentication;
using Infrastructure.Events;
using Microsoft.AspNetCore.Http.HttpResults;
using MongoDB.Driver;
using SharedKernel;

namespace Api.Endpoints.Notes.Create;

public class CreateNoteEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("notes", Handler)
            .WithRequestValidation<CreateNoteRequest>()
            .WithTags(Tags.Notes)
            .HasPermission(PermissionType.CreateNote);
    }

    public static async Task<NoContent> Handler(
        CreateNoteRequest request,
        UserContext userContext,
        IMongoCollection<Note> notesCollection,
        IEventBus eventBus,
        CancellationToken cancellationToken)
    {
        string slug = await GenerateUniqueNoteSlugAsync(notesCollection, request.Title, cancellationToken);

        List<string> tags = request.Tags?
            .Where(tag => !string.IsNullOrWhiteSpace(tag))
            .Select(tag => tag.Trim())
            .Distinct()
            .ToList() ?? [];

        var note = new Note
        {
            Slug = slug,
            Title = request.Title,
            Content = request.Content,
            Tags = tags,
            CreatedBy = userContext.UserId
        };

        await notesCollection.InsertOneAsync(note, null, cancellationToken);

        await eventBus.Send(new CreateNoteEvent(note.Id), cancellationToken);

        return TypedResults.NoContent();
    }

    private static async Task<string> GenerateUniqueNoteSlugAsync(
        IMongoCollection<Note> notesCollection,
        string title,
        CancellationToken cancellationToken)
    {
        string slug = title.GenerateSlug(Constants.Notes.SLUG_SEPARATOR).Truncate(NoteRules.MaxSlugLength);

        if (await IsSlugUniqueAsync(notesCollection, slug, cancellationToken))
        {
            return slug;
        }

        string uniquePostfix = Guid.NewGuid().ToString();

        slug = slug
            .Truncate(NoteRules.MaxSlugLength - Constants.Notes.SLUG_SEPARATOR.Length - uniquePostfix.Length) +
            Constants.Notes.SLUG_SEPARATOR +
            uniquePostfix;

        return slug;
    }

    private static async Task<bool> IsSlugUniqueAsync(
        IMongoCollection<Note> notesCollection,
        string? slug,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(slug))
        {
            return false;
        }

        return !await notesCollection.Find(note => note.Slug == slug).AnyAsync(cancellationToken);
    }
}
