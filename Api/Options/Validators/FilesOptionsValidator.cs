using FluentValidation;

namespace Api.Options.Validators;

public class FilesOptionsValidator : AbstractValidator<FilesOptions>
{
    public FilesOptionsValidator()
    {
        RuleFor(x => x.MaxImageSizeInBytes).GreaterThan(0);
    }
}
