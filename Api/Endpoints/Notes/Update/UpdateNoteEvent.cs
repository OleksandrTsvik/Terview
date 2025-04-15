using Infrastructure.Events;

namespace Api.Endpoints.Notes.Update;

public record UpdateNoteEvent(Guid NoteId) : IEvent;
