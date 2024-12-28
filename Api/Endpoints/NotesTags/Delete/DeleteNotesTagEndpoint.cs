using Domain.Notes;
using Microsoft.AspNetCore.Http.HttpResults;
using MongoDB.Driver;

namespace Api.Endpoints.NotesTags.Delete;

public class DeleteNotesTagEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapDelete("notes/tags/{tag}", Handler)
            .WithTags(Tags.NotesTags)
            .RequireAuthorization();
    }

    public static async Task<Results<NoContent, NotFound>> Handler(
        string tag,
        IMongoCollection<Note> notesCollection,
        CancellationToken cancellationToken)
    {
        FilterDefinition<Note> filter = Builders<Note>.Filter
            .AnyEq(note => note.Tags, tag);

        UpdateDefinition<Note> update = Builders<Note>.Update
            .Pull(note => note.Tags, tag);

        UpdateResult updateResult = await notesCollection.UpdateManyAsync(
            filter,
            update,
            null,
            cancellationToken);

        return updateResult.MatchedCount > 0 ? TypedResults.NoContent() : TypedResults.NotFound();
    }
}
