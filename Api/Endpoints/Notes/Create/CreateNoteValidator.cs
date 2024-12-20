using Api.Extensions;
using Domain.Notes;
using FluentValidation;

namespace Api.Endpoints.Notes.Create;

public class CreateNoteValidator : AbstractValidator<CreateNoteRequest>
{
    public CreateNoteValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty()
            .MinimumLength(NoteRules.MinTitleLength)
            .MaximumLength(NoteRules.MaxTitleLength)
            .TrimWhitespace();

        RuleFor(x => x.Content).NotEmpty();

        RuleForEach(x => x.Tags).NotEmpty();
    }
}
