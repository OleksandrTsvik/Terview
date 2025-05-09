namespace Infrastructure.Options;

public class JobsOptions
{
    public static readonly string ConfigurationSectionName = "Jobs";

    public int DeleteLogsSkipCount { get; init; }
    public int DeleteNotesAfterDays { get; init; }
    public int DeleteProcessedOutboxMessagesAfterDays { get; init; }
    public int DeleteUsersAfterDays { get; init; }
}
