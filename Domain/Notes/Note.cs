namespace Domain.Notes;

public class Note
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public List<string> Tags { get; set; } = [];

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public Guid CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }
    public Guid? UpdatedBy { get; set; }

    public DateTime? DeletedAt { get; set; }
    public Guid? DeletedBy { get; set; }
}
