namespace Api.Endpoints.Notes.GetEdit;

public class NoteResponse
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public List<string> Tags { get; set; } = [];

    public DateTime CreatedOnUtc { get; set; }
    public Guid CreatedBy { get; set; }

    public DateTime? UpdatedOnUtc { get; set; }
    public Guid? UpdatedBy { get; set; }

    public DateTime? DeletedOnUtc { get; set; }
    public Guid? DeletedBy { get; set; }
}
