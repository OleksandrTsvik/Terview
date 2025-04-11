using Domain.Users;
using Infrastructure.Database;
using Infrastructure.Scheduler;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using SharedKernel;

namespace Api.Endpoints.Scheduler.Get;

public class GetJobsEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("scheduler", Handler)
            .WithTags(Tags.Scheduler)
            .HasPermission(PermissionType.ReadJob);
    }

    public static async Task<Ok<GetJobsResponse>> Handler(
        [FromQuery(Name = "q")] string? query,
        [FromQuery(Name = "s")] JobRunStatus? lastRunStatus,
        [FromQuery(Name = "p")] int? pageNumber,
        [FromQuery(Name = "ps")] int? pageSize,
        IMongoCollection<Job> jobsCollection,
        CancellationToken cancellationToken)
    {
        PagedList<Job> jobs = await jobsCollection.AsQueryable()
            .WhereIf(
                !string.IsNullOrWhiteSpace(query),
                job => job.Name.ToLower().Contains(query!.ToLower()))
            .WhereIf(
                lastRunStatus.HasValue,
                job => job.LastRunStatus == lastRunStatus)
            .OrderBy(job => job.Name)
            .ToPagedListAsync(pageNumber, pageSize, cancellationToken);

        List<JobRunStatus> jobRunStatuses = await jobsCollection.AsQueryable()
            .Select(job => job.LastRunStatus)
            .Distinct()
            .OrderBy(lastRunStatus => lastRunStatus)
            .ToListAsync(cancellationToken);

        var responseItems = jobs.Items
            .Select(job => new JobResponse
            {
                Id = job.Id.ToString(),
                Name = job.Name,
                PeriodInSeconds = job.PeriodInSeconds,
                LastRunStatus = job.LastRunStatus,
                LastRunTimeInUtc = job.LastRunTimeInUtc,
                NextRunTimeInUtc = job.NextRunTimeInUtc,
                Error = job.Error
            })
            .ToList();

        var response = new GetJobsResponse(
            jobRunStatuses,
            responseItems,
            jobs.TotalItems,
            jobs.CurrentPage,
            jobs.PageSize);

        return TypedResults.Ok(response);
    }
}
