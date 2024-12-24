using Api.Options;
using Domain.Notes;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace Api.Jobs;

public class DeleteNotesJob : IJob
{
    private readonly int _afterDays;
    private readonly IMongoCollection<Note> _notesCollection;

    public DeleteNotesJob(IOptions<JobsOptions> jobsOptions, IMongoCollection<Note> notesCollection)
    {
        _afterDays = jobsOptions.Value.DeleteNotesAfterDays;
        _notesCollection = notesCollection;
    }

    public async Task Run(CancellationToken cancellationToken = default)
    {
        await _notesCollection.DeleteManyAsync(
            note =>
                note.DeletedOnUtc.HasValue &&
                note.DeletedOnUtc.Value.AddDays(_afterDays) < DateTime.UtcNow,
            cancellationToken);
    }
}
