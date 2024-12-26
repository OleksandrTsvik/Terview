using System.Collections.Concurrent;
using Api.Jobs;
using Api.Options;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.Linq;

namespace Api.Scheduler;

public class SchedulerProcessor
{
    private static readonly ConcurrentDictionary<string, Type?> JobTypeCache = new();

    private readonly int _batchSize;
    private readonly IMongoCollection<Job> _jobsCollection;
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<SchedulerProcessor> _logger;

    public SchedulerProcessor(
        IOptions<SchedulerOptions> schedulerOptions,
        IMongoCollection<Job> jobsCollection,
        IServiceProvider serviceProvider,
        ILogger<SchedulerProcessor> logger)
    {
        _batchSize = schedulerOptions.Value.BatchSize;
        _jobsCollection = jobsCollection;
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    public async Task Execute(CancellationToken cancellationToken = default)
    {
        List<Job> jobs = await _jobsCollection.AsQueryable()
            .Where(job => job.NextRunTimeInUtc <= DateTime.UtcNow)
            .OrderBy(job => job.NextRunTimeInUtc)
            .Take(_batchSize)
            .ToListAsync(cancellationToken);

        if (jobs.Count == 0)
        {
            return;
        }

        var runTasks = jobs
            .Select(job => RunJobAsync(job, cancellationToken))
            .ToList();

        JobUpdate[] jobUpdates = await Task.WhenAll(runTasks);

        await UpdateJobsAsync(jobUpdates, cancellationToken);
    }

    private async Task<JobUpdate> RunJobAsync(Job job, CancellationToken cancellationToken)
    {
        try
        {
            Type? jobType = GetOrAddJobType(job.Type);

            if (jobType is null)
            {
                _logger.LogError("Invalid job type: {JobType}", job.Type);
                return CreateJobUpdate(job, JobRunStatus.Failed, "Invalid job type.");
            }

            var jobService = (IJob)_serviceProvider.GetRequiredService(jobType);
            await jobService.Run(cancellationToken);

            return CreateJobUpdate(job, JobRunStatus.Success);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"An error occurred in {nameof(SchedulerProcessor)}.");
            return CreateJobUpdate(job, JobRunStatus.Failed, ex.ToString());
        }
    }

    private static Type? GetOrAddJobType(string jobType)
    {
        return JobTypeCache.GetOrAdd(
            jobType,
            typename => AssemblyReference.Assembly.GetType(typename));
    }

    private static JobUpdate CreateJobUpdate(
        Job job,
        JobRunStatus status,
        string? error = null)
    {
        return new JobUpdate
        {
            Id = job.Id,
            LastRunStatus = status,
            LastRunTimeInUtc = DateTime.UtcNow,
            NextRunTimeInUtc = DateTime.UtcNow.AddSeconds(job.PeriodInSeconds),
            Error = error
        };
    }

    private async Task UpdateJobsAsync(
        IEnumerable<JobUpdate> jobUpdates,
        CancellationToken cancellationToken)
    {
        var requests = jobUpdates
            .Select(update => new UpdateOneModel<Job>(
                Builders<Job>.Filter.Eq(job => job.Id, update.Id),
                Builders<Job>.Update
                    .Set(job => job.LastRunStatus, update.LastRunStatus)
                    .Set(job => job.LastRunTimeInUtc, update.LastRunTimeInUtc)
                    .Set(job => job.NextRunTimeInUtc, update.NextRunTimeInUtc)
                    .Set(job => job.Error, update.Error)))
            .ToList();

        await _jobsCollection.BulkWriteAsync(requests, null, cancellationToken);
    }

    private readonly struct JobUpdate
    {
        public ObjectId Id { get; init; }
        public JobRunStatus LastRunStatus { get; init; }
        public DateTime LastRunTimeInUtc { get; init; }
        public DateTime NextRunTimeInUtc { get; init; }
        public string? Error { get; init; }
    }
}
