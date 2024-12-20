namespace Api.Endpoints.Notes.Create;

public record CreateNoteRequest(
    string Title,
    string Content,
    List<string>? Tags);
