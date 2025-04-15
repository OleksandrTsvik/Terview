using FluentValidation;
using Infrastructure.Options;

namespace Api.Options.Validators;

public class JwtOptionsValidator : AbstractValidator<JwtOptions>
{
    public JwtOptionsValidator()
    {
        RuleFor(x => x.AccessTokenExpirationInMinutes)
            .GreaterThan(0)
            .LessThan(60 * 24);

        RuleFor(x => x.RefreshTokenExpirationInDays)
            .GreaterThan(0)
            .LessThan(40);

        RuleFor(x => x.SecretKey)
            .NotEmpty()
            .MinimumLength(32);

        RuleFor(x => x.Issuer).NotEmpty();

        RuleFor(x => x.Audience).NotEmpty();
    }
}
