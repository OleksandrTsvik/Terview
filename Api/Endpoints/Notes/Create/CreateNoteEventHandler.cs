using Api.Events;
using Domain.Notes;
using HtmlAgilityPack;
using MongoDB.Driver;

namespace Api.Endpoints.Notes.Create;

public class CreateNoteEventHandler : IEventHandler<CreateNoteEvent>
{
    private readonly IMongoCollection<Note> _notesCollection;
    private readonly IMongoCollection<NoteImage> _noteImagesCollection;

    public CreateNoteEventHandler(
        IMongoCollection<Note> notesCollection,
        IMongoCollection<NoteImage> noteImagesCollection)
    {
        _notesCollection = notesCollection;
        _noteImagesCollection = noteImagesCollection;
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

        List<string> imageUrls = GetImageUrls(note.Content);

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

    private static List<string> GetImageUrls(string html)
    {
        var htmlDoc = new HtmlDocument();
        htmlDoc.LoadHtml(html);

        var imageUrls = htmlDoc.DocumentNode
            .SelectNodes("//img")?
            .Select(img => img.GetAttributeValue("src", string.Empty))
            .Where(src => !string.IsNullOrWhiteSpace(src))
            .ToList();

        return imageUrls ?? [];
    }
}
