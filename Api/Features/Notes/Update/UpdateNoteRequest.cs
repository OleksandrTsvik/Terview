namespace Api.Features.Notes.Update;

public record UpdateNoteRequest(
    string Title,
    string Content,
    List<string>? Tags);
