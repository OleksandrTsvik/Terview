using Domain.Notes;
using Domain.Users;
using Infrastructure.Authentication;
using Infrastructure.Events;
using Microsoft.AspNetCore.Http.HttpResults;
using MongoDB.Driver;

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
        List<string> tags = request.Tags?
            .Where(tag => !string.IsNullOrWhiteSpace(tag))
            .Select(tag => tag.Trim())
            .Distinct()
            .ToList() ?? [];

        var note = new Note
        {
            Title = request.Title,
            Content = request.Content,
            Tags = tags,
            CreatedBy = userContext.UserId
        };

        await notesCollection.InsertOneAsync(note, null, cancellationToken);

        await eventBus.Send(new CreateNoteEvent(note.Id), cancellationToken);

        return TypedResults.NoContent();
    }
}
