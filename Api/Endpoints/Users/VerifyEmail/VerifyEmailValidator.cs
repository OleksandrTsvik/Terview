using Domain.Users;
using FluentValidation;

namespace Api.Endpoints.Users.VerifyEmail;

public class VerifyEmailValidator : AbstractValidator<VerifyEmailRequest>
{
    public VerifyEmailValidator()
    {
        RuleFor(x => x.Token).NotEmpty();

        RuleFor(x => x.Password)
            .MinimumLength(UserRules.MinPasswordLength)
            .MaximumLength(UserRules.MaxPasswordLength);
    }
}
