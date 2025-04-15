namespace Api.Options.Models;

public class CorsOptions
{
    public static readonly string ConfigurationSectionName = "Cors";

    public required string[] Origins { get; init; }
}
