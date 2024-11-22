namespace Api.Features.Notes.Create;

public record CreateNoteRequest(
    string Title,
    string Content,
    List<string> Tags);
