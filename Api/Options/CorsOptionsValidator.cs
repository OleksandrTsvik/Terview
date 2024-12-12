using FluentValidation;

namespace Api.Options;

public class CorsOptionsValidator : AbstractValidator<CorsOptions>
{
    public CorsOptionsValidator()
    {
        RuleFor(x => x.Origins).NotEmpty();
    }
}
