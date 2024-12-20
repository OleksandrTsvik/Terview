namespace Api.Options;

public class JwtOptions
{
    public static readonly string ConfigurationSectionName = "Jwt";

    public double AccessTokenExpirationInMinutes { get; init; }
    public double RefreshTokenExpirationInDays { get; init; }
    public required string SecretKey { get; init; }
    public required string Issuer { get; init; }
    public required string Audience { get; init; }
}
