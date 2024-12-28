namespace Api.Endpoints.NotesTags.Update;

public record UpdateNotesTagRequest(
    string CurrentTag,
    string NewTag);
