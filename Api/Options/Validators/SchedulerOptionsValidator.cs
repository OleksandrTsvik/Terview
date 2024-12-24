using FluentValidation;

namespace Api.Options.Validators;

public class SchedulerOptionsValidator : AbstractValidator<SchedulerOptions>
{
    public SchedulerOptionsValidator()
    {
        RuleFor(x => x.PeriodInSeconds).GreaterThan(0);

        RuleFor(x => x.BatchSize).GreaterThan(0);
    }
}
