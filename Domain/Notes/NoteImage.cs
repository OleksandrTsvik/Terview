namespace Domain.Notes;

public class NoteImage
{
    public Guid Id { get; set; }
    public string Url { get; set; } = string.Empty;
    public string UniqueName { get; set; } = string.Empty;
    public List<Guid> NoteIds { get; set; } = [];
    public DateTime CreatedOnUtc { get; set; } = DateTime.UtcNow;
}
