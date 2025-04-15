using Domain.Notes;
using Domain.Users;
using Microsoft.AspNetCore.Http.HttpResults;
using MongoDB.Driver;

namespace Api.Endpoints.NotesTags.Update;

public class UpdateNotesTagEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPatch("notes/tags", Handler)
            .WithTags(Tags.NotesTags)
            .WithRequestValidation<UpdateNotesTagRequest>()
            .HasPermission(PermissionType.UpdateNoteTag);
    }

    public static async Task<Results<NoContent, NotFound>> Handler(
        UpdateNotesTagRequest request,
        IMongoCollection<Note> notesCollection,
        CancellationToken cancellationToken)
    {
        FilterDefinition<Note> filter = Builders<Note>.Filter
            .AnyEq(note => note.Tags, request.CurrentTag);

        var requests = new List<UpdateManyModel<Note>>
        {
            new(filter, Builders<Note>.Update.AddToSet(note => note.Tags, request.NewTag)),
            new(filter, Builders<Note>.Update.Pull(note => note.Tags, request.CurrentTag)),
        };

        var options = new BulkWriteOptions
        {
            IsOrdered = true
        };

        BulkWriteResult<Note> bulkWriteResult = await notesCollection.BulkWriteAsync(
            requests,
            options,
            cancellationToken);

        return bulkWriteResult.MatchedCount > 0 ? TypedResults.NoContent() : TypedResults.NotFound();
    }
}
