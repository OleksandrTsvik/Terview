using Api.Options;
using CloudinaryDotNet;
using Microsoft.Extensions.Options;
using SharedKernel;

namespace Api.Infrastructure;

public class CloudinaryImageProvider : IImageProvider
{
    private readonly Cloudinary _cloudinary;

    public CloudinaryImageProvider(IOptions<CloudinaryOptions> cloudinaryOptions)
    {
        var account = new Account(
            cloudinaryOptions.Value.CloudName,
            cloudinaryOptions.Value.ApiKey,
            cloudinaryOptions.Value.ApiSecret);

        _cloudinary = new Cloudinary(account);
    }

    public async Task<ImageUploadResult> UploadAsync(
        IFormFile image,
        CancellationToken cancellationToken = default)
    {
        using Stream stream = image.OpenReadStream();

        var uploadParams = new CloudinaryDotNet.Actions.ImageUploadParams
        {
            File = new FileDescription(image.FileName, stream)
        };

        CloudinaryDotNet.Actions.ImageUploadResult uploadResult = await _cloudinary.UploadAsync(
            uploadParams,
            cancellationToken);

        if (uploadResult.Error is not null)
        {
            throw new ApplicationException(uploadResult.Error.Message);
        }

        return new ImageUploadResult
        {
            Url = uploadResult.Url.ToString(),
            OriginalName = image.FileName,
            UniqueName = uploadResult.PublicId
        };
    }

    public async Task DeleteAsync(string uniqueImageName, CancellationToken cancellationToken = default)
    {
        var deletionParams = new CloudinaryDotNet.Actions.DeletionParams(uniqueImageName);

        await _cloudinary.DestroyAsync(deletionParams);
    }
}
