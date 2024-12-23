using Api.Extensions;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using SharedKernel;

namespace Api.Endpoints.Logs.Get;

public class GetLogsEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("logs", Handler)
            .WithTags(Tags.Logs)
            .RequireAuthorization();
    }

    public static async Task<Ok<GetLogsResponse>> Handler(
        [FromQuery(Name = "l")] string[]? levels,
        [FromQuery(Name = "p")] int? pageNumber,
        [FromQuery(Name = "ps")] int? pageSize,
        IMongoCollection<Log> logsCollection,
        CancellationToken cancellationToken)
    {
        PagedList<Log> logs = await logsCollection.AsQueryable()
            .WhereIf(
                levels?.Length > 0,
                log => levels!.Contains(log.Level))
            .OrderByDescending(log => log.UtcTimeStamp)
            .ToPagedListAsync(pageNumber, pageSize, cancellationToken);

        List<string> logLevels = await logsCollection.AsQueryable()
            .Select(log => log.Level)
            .Distinct()
            .OrderBy(log => log)
            .ToListAsync(cancellationToken);

        var responseItems = logs.Items
            .Select(log => new LogResponse
            {
                Id = log.Id.ToString(),
                Level = log.Level,
                Message = log.RenderedMessage,
                CreatedOnUtc = log.UtcTimeStamp,
                Metadata = log.Metadata.ToJson()
            })
            .ToList();

        var response = new GetLogsResponse(
            logLevels,
            responseItems,
            logs.TotalItems,
            logs.CurrentPage,
            logs.PageSize);

        return TypedResults.Ok(response);
    }
}
