namespace Api.Endpoints.NotesImages.Get;

public class NoteImageResponse
{
    public Guid Id { get; set; }
    public string Url { get; set; } = string.Empty;
    public string UniqueName { get; set; } = string.Empty;
    public int NoteCount { get; set; }
}
