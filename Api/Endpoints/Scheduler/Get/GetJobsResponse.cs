using Infrastructure.Scheduler;
using SharedKernel;

namespace Api.Endpoints.Scheduler.Get;

public class GetJobsResponse : PagedList<JobResponse>
{
    public List<JobRunStatus> JobRunStatuses { get; set; }

    public GetJobsResponse(
        List<JobRunStatus> jobRunStatuses,
        List<JobResponse> items,
        int totalItems,
        int pageNumber,
        int pageSize)
        : base(items, totalItems, pageNumber, pageSize)
    {
        JobRunStatuses = jobRunStatuses;
    }
}

public class JobResponse
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string CronExpression { get; set; } = string.Empty;
    public JobRunStatus LastRunStatus { get; set; }
    public DateTime? LastRunTimeInUtc { get; set; }
    public DateTime NextRunTimeInUtc { get; set; }
    public string? Error { get; set; }
}
