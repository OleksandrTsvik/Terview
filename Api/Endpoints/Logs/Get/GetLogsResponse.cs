using SharedKernel;

namespace Api.Endpoints.Logs.Get;

public class GetLogsResponse : PagedList<LogResponse>
{
    public List<string> LogLevels { get; set; }

    public GetLogsResponse(
        List<string> logLevels,
        List<LogResponse> items,
        int totalItems,
        int pageNumber,
        int pageSize)
        : base(items, totalItems, pageNumber, pageSize)
    {
        LogLevels = logLevels;
    }
}

public class LogResponse
{
    public string Id { get; set; } = string.Empty;
    public string Level { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public DateTime CreatedOnUtc { get; set; }
    public string? Metadata { get; set; }
}
