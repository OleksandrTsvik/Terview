using Api.Extensions;
using Api.Infrastructure;
using Domain.Notes;
using Domain.Users;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using SharedKernel;

namespace Api.Endpoints.NotesImages.Upload;

public class UploadNoteImageEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("notes/images", Handler)
            .WithRequestValidation<UploadNoteImageRequest>()
            .WithTags(Tags.NotesImages)
            .DisableAntiforgery()
            .HasPermission(PermissionType.UploadNoteImage);
    }

    public static async Task<Ok<UploadNoteImageResponse>> Handler(
        [FromForm] UploadNoteImageRequest request,
        IImageProvider imageProvider,
        IMongoCollection<NoteImage> noteImagesCollection,
        CancellationToken cancellationToken)
    {
        ImageUploadResult uploadResult = await imageProvider.UploadAsync(request.Upload, cancellationToken);

        var noteImage = new NoteImage
        {
            Url = uploadResult.Url,
            UniqueName = uploadResult.UniqueName
        };

        await noteImagesCollection.InsertOneAsync(noteImage, null, cancellationToken);

        var response = new UploadNoteImageResponse
        {
            Url = uploadResult.Url
        };

        return TypedResults.Ok(response);
    }
}
