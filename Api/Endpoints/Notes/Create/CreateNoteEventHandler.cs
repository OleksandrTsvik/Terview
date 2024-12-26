using Api.Events;

namespace Api.Endpoints.Notes.Create;

public class CreateNoteEventHandler : IEventHandler<CreateNoteEvent>
{
    private readonly ILogger<CreateNoteEventHandler> _logger;

    public CreateNoteEventHandler(ILogger<CreateNoteEventHandler> logger)
    {
        _logger = logger;
    }

    public Task Handle(CreateNoteEvent message, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Created note: {NoteId}.", message.NoteId);

        return Task.CompletedTask;
    }
}
