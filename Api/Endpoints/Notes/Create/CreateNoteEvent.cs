using Api.Events;

namespace Api.Endpoints.Notes.Create;

public record CreateNoteEvent(Guid NoteId) : IEvent;
