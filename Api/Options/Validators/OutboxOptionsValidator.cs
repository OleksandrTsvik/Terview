using FluentValidation;
using Infrastructure.Options;

namespace Api.Options.Validators;

public class OutboxOptionsValidator : AbstractValidator<OutboxOptions>
{
    public OutboxOptionsValidator()
    {
        RuleFor(x => x.PeriodInSeconds).GreaterThan(0);

        RuleFor(x => x.BatchSize).GreaterThan(0);
    }
}
