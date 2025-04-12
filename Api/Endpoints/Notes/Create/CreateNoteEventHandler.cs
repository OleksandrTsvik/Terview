using Domain.Notes;
using Infrastructure.Events;
using Infrastructure.Parsers;
using MongoDB.Driver;

namespace Api.Endpoints.Notes.Create;

public class CreateNoteEventHandler : IEventHandler<CreateNoteEvent>
{
    private readonly IMongoCollection<Note> _notesCollection;
    private readonly IMongoCollection<NoteImage> _noteImagesCollection;
    private readonly IHtmlParser _htmlParser;

    public CreateNoteEventHandler(
        IMongoCollection<Note> notesCollection,
        IMongoCollection<NoteImage> noteImagesCollection,
        IHtmlParser htmlParser)
    {
        _notesCollection = notesCollection;
        _noteImagesCollection = noteImagesCollection;
        _htmlParser = htmlParser;
    }

    public async Task Handle(CreateNoteEvent message, CancellationToken cancellationToken = default)
    {
        Note? note = await _notesCollection
            .Find(note => note.Id == message.NoteId)
            .FirstOrDefaultAsync(cancellationToken);

        if (note is null)
        {
            return;
        }

        HashSet<string> imageUrls = _htmlParser.GetImageUrls(note.Content);

        if (imageUrls.Count == 0)
        {
            return;
        }

        var requests = imageUrls
            .Select(url => new UpdateOneModel<NoteImage>(
                Builders<NoteImage>.Filter.Eq(noteImage => noteImage.Url, url),
                Builders<NoteImage>.Update.AddToSet(noteImage => noteImage.NoteIds, note.Id)))
            .ToList();

        await _noteImagesCollection.BulkWriteAsync(requests, null, cancellationToken);
    }
}
