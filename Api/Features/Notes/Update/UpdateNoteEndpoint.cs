using Api.Endpoints;
using Api.Features.Notes.Create;
using Domain.Notes;
using Microsoft.AspNetCore.Http.HttpResults;
using MongoDB.Driver;

namespace Api.Features.Notes.Update;

public class UpdateNoteEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPut("notes/{id:guid}", Handler)
            .WithTags(EndpointTags.Notes);
    }

    public static async Task<Results<NoContent, NotFound>> Handler(
        Guid id,
        CreateNoteRequest request,
        IMongoCollection<Note> notesCollection,
        CancellationToken cancellationToken)
    {
        List<string> tags = request.Tags?
            .Where(tag => !string.IsNullOrWhiteSpace(tag))
            .Select(tag => tag.Trim())
            .Distinct()
            .ToList() ?? [];

        FilterDefinition<Note> filter = Builders<Note>.Filter.Eq(note => note.Id, id);

        UpdateDefinition<Note> update = Builders<Note>.Update
            .Set(note => note.Title, request.Title)
            .Set(note => note.Content, request.Content)
            .Set(note => note.Tags, tags)
            .Set(note => note.UpdatedAt, DateTime.UtcNow)
            .Set(note => note.UpdatedBy, Guid.Empty);

        UpdateResult updateResult = await notesCollection
            .UpdateOneAsync(
                filter,
                update,
                null,
                cancellationToken);

        return updateResult.ModifiedCount > 0 ? TypedResults.NoContent() : TypedResults.NotFound();
    }
}
