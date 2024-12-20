using Domain.Users;
using FluentValidation;

namespace Api.Options.Validators;

public class SeedOptionsValidator : AbstractValidator<SeedOptions>
{
    public SeedOptionsValidator()
    {
        RuleFor(x => x.Users).NotNull();

        RuleForEach(x => x.Users).ChildRules(user =>
        {
            user.RuleFor(x => x.Email).EmailAddress();

            user.RuleFor(x => x.Password)
                .MinimumLength(UserRules.MinPasswordLength)
                .MaximumLength(UserRules.MaxPasswordLength);
        });
    }
}
