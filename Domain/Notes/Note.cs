namespace Domain.Notes;

public class Note
{
    public Guid Id { get; set; }
    public string Slug { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public List<string> Tags { get; set; } = [];

    public DateTime CreatedOnUtc { get; set; } = DateTime.UtcNow;
    public Guid CreatedBy { get; set; }

    public DateTime? UpdatedOnUtc { get; set; }
    public Guid? UpdatedBy { get; set; }

    public DateTime? DeletedOnUtc { get; set; }
    public Guid? DeletedBy { get; set; }
}
