using FluentValidation;

namespace Api.Options.Validators;

public class EmailOptionsValidator : AbstractValidator<EmailOptions>
{
    public EmailOptionsValidator()
    {
        RuleFor(x => x.Host).NotEmpty();

        RuleFor(x => x.Port).GreaterThan(0);

        RuleFor(x => x.SenderName).NotEmpty();

        RuleFor(x => x.SenderEmail).NotEmpty();

        RuleFor(x => x.Username).NotEmpty();

        RuleFor(x => x.Password).NotEmpty();

        RuleFor(x => x.VerificationTokenExpirationInHours).GreaterThan(0);

        RuleFor(x => x.VerificationRedirectUrl).NotEmpty();
    }
}
