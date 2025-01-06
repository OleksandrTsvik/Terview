using FluentValidation;

namespace Api.Options.Validators;

public class SecurityOptionsValidator : AbstractValidator<SecurityOptions>
{
    public SecurityOptionsValidator()
    {
        RuleFor(x => x.EmailVerificationTokenExpirationInHours).GreaterThan(0);

        RuleFor(x => x.EmailVerificationRedirectUrl).NotEmpty();

        RuleFor(x => x.MaxUserPasswordResetTokens)
            .GreaterThan(0)
            .LessThan(30);

        RuleFor(x => x.PasswordResetTokenExpirationInMinutes).GreaterThan(0);

        RuleFor(x => x.PasswordResetRedirectUrl).NotEmpty();
    }
}
