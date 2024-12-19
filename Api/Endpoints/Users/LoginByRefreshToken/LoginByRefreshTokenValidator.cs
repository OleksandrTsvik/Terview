using FluentValidation;

namespace Api.Endpoints.Users.LoginByRefreshToken;

public class LoginByRefreshTokenValidator : AbstractValidator<LoginByRefreshTokenRequest>
{
    public LoginByRefreshTokenValidator()
    {
        RuleFor(x => x.RefreshToken).NotEmpty();
    }
}
