using Api.Extensions;
using Domain.Notes;
using FluentValidation;

namespace Api.Features.Notes.Update;

public class UpdateNoteValidator : AbstractValidator<UpdateNoteRequest>
{
    public UpdateNoteValidator()
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
