using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Infrastructure.Scheduler;

[BsonIgnoreExtraElements]
public class Job
{
    public ObjectId Id { get; set; }
    public string Type { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string CronExpression { get; set; } = string.Empty;
    public JobRunStatus LastRunStatus { get; set; }
    public DateTime? LastRunTimeInUtc { get; set; }
    public DateTime NextRunTimeInUtc { get; set; }
    public string? Error { get; set; }

    public Job()
    {
        LastRunStatus = JobRunStatus.New;
        NextRunTimeInUtc = DateTime.UtcNow.AddMinutes(5);
    }
}

public enum JobRunStatus
{
    New,
    Success,
    Failed
}
