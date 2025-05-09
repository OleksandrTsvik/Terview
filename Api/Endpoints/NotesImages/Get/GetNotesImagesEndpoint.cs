using Domain.Notes;
using Domain.Users;
using Infrastructure.Database;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using SharedKernel;

namespace Api.Endpoints.NotesImages.Get;

public class GetNotesImagesEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("notes/images", Handler)
            .WithTags(Tags.NotesImages)
            .HasPermission(PermissionType.ReadNoteImage);
    }

    public static async Task<Ok<PagedList<NoteImageResponse>>> Handler(
        [FromQuery(Name = "p")] int? pageNumber,
        [FromQuery(Name = "ps")] int? pageSize,
        IMongoCollection<NoteImage> noteImagesCollection,
        CancellationToken cancellationToken)
    {
        PagedList<NoteImageResponse> noteImages = await noteImagesCollection.AsQueryable()
            .OrderBy(noteImage => noteImage.NoteIds.Count)
            .ThenBy(noteImage => noteImage.CreatedOnUtc)
            .Select(noteImage => new NoteImageResponse
            {
                Id = noteImage.Id,
                Url = noteImage.Url,
                UniqueName = noteImage.UniqueName,
                NoteCount = noteImage.NoteIds.Count
            })
            .ToPagedListAsync(pageNumber, pageSize, cancellationToken);

        return TypedResults.Ok(noteImages);
    }
}
