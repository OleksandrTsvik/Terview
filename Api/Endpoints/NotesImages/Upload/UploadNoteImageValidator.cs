using Api.Extensions;
using Api.Options;
using FluentValidation;
using Microsoft.Extensions.Options;

namespace Api.Endpoints.NotesImages.Upload;

public class UploadNoteImageValidator : AbstractValidator<UploadNoteImageRequest>
{
    public UploadNoteImageValidator(IOptions<FilesOptions> filesOptions)
    {
        RuleFor(x => x.Upload).Image(filesOptions.Value.MaxImageSizeInBytes);
    }
}
