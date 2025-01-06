using FluentValidation;

namespace Api.Endpoints.Users.ForgotPassword;

public class ForgotPasswordValidator : AbstractValidator<ForgotPasswordRequest>
{
    public ForgotPasswordValidator()
    {
        RuleFor(x => x.Email).EmailAddress();
    }
}
