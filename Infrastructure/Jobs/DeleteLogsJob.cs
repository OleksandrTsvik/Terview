using Infrastructure.Database;
using Infrastructure.Options;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using MongoDB.Driver.Linq;

namespace Infrastructure.Jobs;

public class DeleteLogsJob : IJob
{
    private readonly int _skip;
    private readonly IMongoCollection<Log> _logsCollection;

    public DeleteLogsJob(IOptions<JobsOptions> jobsOptions, IMongoCollection<Log> logsCollection)
    {
        _skip = jobsOptions.Value.DeleteLogsSkipCount;
        _logsCollection = logsCollection;
    }

    public async Task Run(CancellationToken cancellationToken = default)
    {
        Log? lastLog = await _logsCollection.AsQueryable()
            .OrderByDescending(log => log.UtcTimeStamp)
            .Skip(_skip)
            .FirstOrDefaultAsync(cancellationToken);

        if (lastLog is null)
        {
            return;
        }

        await _logsCollection.DeleteManyAsync(
            log => log.UtcTimeStamp <= lastLog.UtcTimeStamp,
            cancellationToken);
    }
}
