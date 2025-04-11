namespace Api.Options.Models;

public class FilesOptions
{
    public static readonly string ConfigurationSectionName = "Files";

    public required long MaxImageSizeInBytes { get; init; }
}
