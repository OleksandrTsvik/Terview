using Domain.Notes;
using Infrastructure.Events;
using Infrastructure.Parsers;
using MongoDB.Driver;

namespace Api.Endpoints.Notes.Update;

public class UpdateNoteEventHandler : IEventHandler<UpdateNoteEvent>
{
    private readonly IMongoCollection<Note> _notesCollection;
    private readonly IMongoCollection<NoteImage> _noteImagesCollection;
    private readonly IHtmlParser _htmlParser;

    public UpdateNoteEventHandler(
        IMongoCollection<Note> notesCollection,
        IMongoCollection<NoteImage> noteImagesCollection,
        IHtmlParser htmlParser)
    {
        _notesCollection = notesCollection;
        _noteImagesCollection = noteImagesCollection;
        _htmlParser = htmlParser;
    }

    public async Task Handle(UpdateNoteEvent message, CancellationToken cancellationToken = default)
    {
        Note? note = await _notesCollection
            .Find(note => note.Id == message.NoteId)
            .FirstOrDefaultAsync(cancellationToken);

        if (note is null)
        {
            await DeleteNoteIdFromNoteImagesAsync(message.NoteId, cancellationToken);

            return;
        }

        await UpdateNoteIdsInNoteImagesAsync(note, cancellationToken);
    }

    private async Task DeleteNoteIdFromNoteImagesAsync(
        Guid noteId,
        CancellationToken cancellationToken)
    {
        FilterDefinition<NoteImage> filter = Builders<NoteImage>.Filter
            .AnyEq(noteImage => noteImage.NoteIds, noteId);

        UpdateDefinition<NoteImage> update = Builders<NoteImage>.Update
            .Pull(noteImage => noteImage.NoteIds, noteId);

        await _noteImagesCollection.UpdateManyAsync(
            filter,
            update,
            null,
            cancellationToken);
    }

    private async Task UpdateNoteIdsInNoteImagesAsync(
        Note note,
        CancellationToken cancellationToken)
    {
        HashSet<string> imageUrls = _htmlParser.GetImageUrls(note.Content);

        var requests = imageUrls
            .Select(url => new UpdateOneModel<NoteImage>(
                Builders<NoteImage>.Filter.Eq(noteImage => noteImage.Url, url),
                Builders<NoteImage>.Update.AddToSet(noteImage => noteImage.NoteIds, note.Id)))
            .ToList<WriteModel<NoteImage>>();

        requests.Add(new UpdateManyModel<NoteImage>(
            Builders<NoteImage>.Filter.And(
                Builders<NoteImage>.Filter.Nin(noteImage => noteImage.Url, imageUrls),
                Builders<NoteImage>.Filter.AnyEq(noteImage => noteImage.NoteIds, note.Id)),
            Builders<NoteImage>.Update.Pull(noteImage => noteImage.NoteIds, note.Id)));

        await _noteImagesCollection.BulkWriteAsync(requests, null, cancellationToken);
    }
}
