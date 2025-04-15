namespace Infrastructure.Options;

public class CloudinaryOptions
{
    public static readonly string ConfigurationSectionName = "Cloudinary";

    public required string CloudName { get; init; }
    public required string ApiKey { get; init; }
    public required string ApiSecret { get; init; }
}
