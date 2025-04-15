namespace Infrastructure.Options;

public class OutboxOptions
{
    public static readonly string ConfigurationSectionName = "Outbox";

    public double PeriodInSeconds { get; init; }
    public int BatchSize { get; init; }
}
