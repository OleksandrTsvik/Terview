using FluentValidation;

namespace Api.Endpoints.NotesTags.Update;

public class UpdateNotesTagValidator : AbstractValidator<UpdateNotesTagRequest>
{
    public UpdateNotesTagValidator()
    {
        RuleFor(x => x.CurrentTag).NotEmpty();

        RuleFor(x => x.NewTag).NotEmpty();
    }
}
