namespace Api.Options;

public class EmailOptions
{
    public static readonly string ConfigurationSectionName = "Email";

    public required string Host { get; init; }
    public required int Port { get; init; }
    public required string SenderName { get; init; }
    public required string SenderEmail { get; init; }
    public required string Username { get; init; }
    public required string Password { get; init; }
}
