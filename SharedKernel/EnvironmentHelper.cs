namespace SharedKernel;

public static class EnvironmentHelper
{
    public static readonly string? EnvironmentName =
        Environment.GetEnvironmentVariable("ENVIRONMENT")?.Trim().ToLower();

    public static readonly bool IsProduction =
        string.IsNullOrWhiteSpace(EnvironmentName) || EnvironmentName == "production";

    public static readonly bool IsDevelopment = EnvironmentName == "development";

    public static readonly bool IsLocal = EnvironmentName == "local";

    public static bool IsEnvironment(string environmentName) =>
        environmentName.Trim().ToLower() == EnvironmentName;
}
