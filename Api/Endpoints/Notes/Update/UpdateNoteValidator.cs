using Api.Extensions;
using Domain;
using Domain.Notes;
using FluentValidation;
using SharedKernel;

namespace Api.Endpoints.Notes.Update;

public class UpdateNoteValidator : AbstractValidator<UpdateNoteRequest>
{
    public UpdateNoteValidator()
    {
        RuleFor(x => x.Slug)
            .NotEmpty()
            .MinimumLength(NoteRules.MinSlugLength)
            .MaximumLength(NoteRules.MaxSlugLength)
            .TrimWhitespace()
            .Must(slug => slug.IsValidSlug(Constants.Notes.SLUG_SEPARATOR))
            .WithMessage("Invalid slug.");

        RuleFor(x => x.Title)
            .NotEmpty()
            .MinimumLength(NoteRules.MinTitleLength)
            .MaximumLength(NoteRules.MaxTitleLength)
            .TrimWhitespace();

        RuleFor(x => x.Content).NotEmpty();

        RuleForEach(x => x.Tags).NotEmpty();
    }
}
