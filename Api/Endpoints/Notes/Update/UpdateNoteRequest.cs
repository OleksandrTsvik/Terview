namespace Api.Endpoints.Notes.Update;

public record UpdateNoteRequest(
    string Slug,
    string Title,
    string Content,
    List<string>? Tags);
