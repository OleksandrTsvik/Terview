namespace Infrastructure.Options;

public class SecurityOptions
{
    public static readonly string ConfigurationSectionName = "Security";

    public required int EmailVerificationTokenExpirationInHours { get; init; }
    public required string EmailVerificationRedirectUrl { get; init; }
    public required int MaxUserPasswordResetTokens { get; init; }
    public required int PasswordResetTokenExpirationInMinutes { get; init; }
    public required string PasswordResetRedirectUrl { get; init; }
}
