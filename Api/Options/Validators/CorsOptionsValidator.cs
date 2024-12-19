using FluentValidation;

namespace Api.Options.Validators;

public class CorsOptionsValidator : AbstractValidator<CorsOptions>
{
    public CorsOptionsValidator()
    {
        RuleFor(x => x.Origins).NotEmpty();
    }
}
