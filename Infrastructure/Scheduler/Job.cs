using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Infrastructure.Scheduler;

[BsonIgnoreExtraElements]
public class Job
{
    public ObjectId Id { get; set; }
    public string Type { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public long PeriodInSeconds { get; set; }
    public JobRunStatus LastRunStatus { get; set; }
    public DateTime? LastRunTimeInUtc { get; set; }
    public DateTime NextRunTimeInUtc { get; set; }
    public string? Error { get; set; }

    public Job()
    {
        LastRunStatus = JobRunStatus.New;
        NextRunTimeInUtc = DateTime.UtcNow.AddSeconds(PeriodInSeconds);
    }
}

public enum JobRunStatus
{
    New,
    Success,
    Failed
}
