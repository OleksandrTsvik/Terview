namespace Api.Options;

public class SchedulerOptions
{
    public static readonly string ConfigurationSectionName = "Scheduler";

    public double PeriodInSeconds { get; init; }
    public int BatchSize { get; init; }
}
