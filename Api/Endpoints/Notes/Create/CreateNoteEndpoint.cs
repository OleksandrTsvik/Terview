using Api.Authentication;
using Api.Extensions;
using Domain.Notes;
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
            .RequireAuthorization();
    }

    public static async Task<NoContent> Handler(
        CreateNoteRequest request,
        UserContext userContext,
        IMongoCollection<Note> notesCollection,
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

        return TypedResults.NoContent();
    }
}
