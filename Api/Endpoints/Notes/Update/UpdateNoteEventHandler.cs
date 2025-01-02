using Api.Events;
using Domain.Notes;
using HtmlAgilityPack;
using MongoDB.Driver;

namespace Api.Endpoints.Notes.Update;

public class UpdateNoteEventHandler : IEventHandler<UpdateNoteEvent>
{
    private readonly IMongoCollection<Note> _notesCollection;
    private readonly IMongoCollection<NoteImage> _noteImagesCollection;

    public UpdateNoteEventHandler(
        IMongoCollection<Note> notesCollection,
        IMongoCollection<NoteImage> noteImagesCollection)
    {
        _notesCollection = notesCollection;
        _noteImagesCollection = noteImagesCollection;
    }

    public async Task Handle(UpdateNoteEvent message, CancellationToken cancellationToken = default)
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
            .ToList<WriteModel<NoteImage>>();

        requests.Add(new UpdateManyModel<NoteImage>(
            Builders<NoteImage>.Filter.And(
                Builders<NoteImage>.Filter.Nin(noteImage => noteImage.Url, imageUrls),
                Builders<NoteImage>.Filter.AnyEq(noteImage => noteImage.NoteIds, note.Id)),
            Builders<NoteImage>.Update.Pull(noteImage => noteImage.NoteIds, note.Id)));

        await _noteImagesCollection.BulkWriteAsync(requests, null, cancellationToken);
    }

    private static List<string> GetImageUrls(string html)
    {
        var htmlDoc = new HtmlDocument();
        htmlDoc.LoadHtml(html);

        var imageUrls = htmlDoc.DocumentNode
            .SelectNodes("//img")?
            .Select(img => img.GetAttributeValue("src", null))
            .Where(src => !string.IsNullOrWhiteSpace(src))
            .ToList();

        return imageUrls ?? [];
    }
}
