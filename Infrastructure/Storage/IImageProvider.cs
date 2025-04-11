using Microsoft.AspNetCore.Http;

namespace Infrastructure.Storage;

public interface IImageProvider
{
    Task<ImageUploadResult> UploadAsync(
        IFormFile image,
        CancellationToken cancellationToken = default);

    Task DeleteAsync(string uniqueImageName, CancellationToken cancellationToken = default);
}
