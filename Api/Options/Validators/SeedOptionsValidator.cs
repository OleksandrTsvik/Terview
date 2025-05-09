using Domain.Users;
using FluentValidation;
using Infrastructure.Options;

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

            user.RuleFor(x => x.Permissions).ForEach(permission => permission.IsInEnum());
        });
    }
}
