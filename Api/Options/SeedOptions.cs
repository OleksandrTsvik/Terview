namespace Api.Options;

public class SeedOptions
{
    public static readonly string ConfigurationSectionName = "Seed";

    public required UserSeed[] Users { get; init; }
}

public class UserSeed
{
    public required string Email { get; init; }
    public required string Password { get; init; }
}
