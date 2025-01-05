using Api.Infrastructure;
using Domain.Notes;
using Microsoft.AspNetCore.Http.HttpResults;
using MongoDB.Driver;

namespace Api.Endpoints.NotesImages.Delete;

public class DeleteNoteImageEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapDelete("notes/images/{name}", Handler)
            .WithTags(Tags.NotesImages)
            .RequireAuthorization();
    }

    public static async Task<Results<NoContent, NotFound>> Handler(
        string name,
        IImageProvider imageProvider,
        IMongoCollection<NoteImage> noteImagesCollection,
        CancellationToken cancellationToken)
    {
        await imageProvider.DeleteAsync(name, cancellationToken);

        DeleteResult deleteResult = await noteImagesCollection.DeleteOneAsync(
            noteImage => noteImage.UniqueName == name,
            cancellationToken);

        return deleteResult.DeletedCount > 0 ? TypedResults.NoContent() : TypedResults.NotFound();
    }
}
