using Api.Options;
using Domain.Notes;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using MongoDB.Driver.Linq;

namespace Api.Jobs;

public class DeleteNotesJob : IJob
{
    private const int BatchSize = 50;

    private readonly int _afterDays;
    private readonly IMongoCollection<Note> _notesCollection;
    private readonly IMongoCollection<NoteImage> _noteImagesCollection;

    public DeleteNotesJob(
        IOptions<JobsOptions> jobsOptions,
        IMongoCollection<Note> notesCollection,
        IMongoCollection<NoteImage> noteImagesCollection)
    {
        _afterDays = jobsOptions.Value.DeleteNotesAfterDays;
        _notesCollection = notesCollection;
        _noteImagesCollection = noteImagesCollection;
    }

    public async Task Run(CancellationToken cancellationToken = default)
    {
        List<Guid> noteIds = await GetNoteIdsAsync(cancellationToken);

        while (noteIds.Count > 0)
        {
            await DeleteNotesByIdsAsync(noteIds, cancellationToken);
            await DeleteNoteIdsFromNoteImagesAsync(noteIds, cancellationToken);

            noteIds = await GetNoteIdsAsync(cancellationToken);
        }
    }

    private Task<List<Guid>> GetNoteIdsAsync(CancellationToken cancellationToken)
    {
        return _notesCollection.AsQueryable()
            .Where(note =>
                note.DeletedOnUtc.HasValue &&
                note.DeletedOnUtc.Value.AddDays(_afterDays) < DateTime.UtcNow)
            .Select(note => note.Id)
            .Take(BatchSize)
            .ToListAsync(cancellationToken);
    }

    private async Task DeleteNotesByIdsAsync(List<Guid> noteIds, CancellationToken cancellationToken)
    {
        await _notesCollection.DeleteManyAsync(note => noteIds.Contains(note.Id), cancellationToken);
    }

    private async Task DeleteNoteIdsFromNoteImagesAsync(
        List<Guid> noteIds,
        CancellationToken cancellationToken)
    {
        FilterDefinition<NoteImage> filter = Builders<NoteImage>.Filter
            .AnyIn(noteImage => noteImage.NoteIds, noteIds);

        UpdateDefinition<NoteImage> update = Builders<NoteImage>.Update
            .PullFilter(noteImage => noteImage.NoteIds, noteId => noteIds.Contains(noteId));

        await _noteImagesCollection.UpdateManyAsync(
            filter,
            update,
            null,
            cancellationToken);
    }
}
