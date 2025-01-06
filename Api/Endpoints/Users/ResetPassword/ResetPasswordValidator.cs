using Domain.Users;
using FluentValidation;

namespace Api.Endpoints.Users.ResetPassword;

public class ResetPasswordValidator : AbstractValidator<ResetPasswordRequest>
{
    public ResetPasswordValidator()
    {
        RuleFor(x => x.Token).NotEmpty();

        RuleFor(x => x.Password)
            .MinimumLength(UserRules.MinPasswordLength)
            .MaximumLength(UserRules.MaxPasswordLength);
    }
}
