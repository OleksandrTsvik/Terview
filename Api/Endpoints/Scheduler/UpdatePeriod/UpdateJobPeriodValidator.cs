using FluentValidation;

namespace Api.Endpoints.Scheduler.UpdatePeriod;

public class UpdateJobPeriodValidator : AbstractValidator<UpdateJobPeriodRequest>
{
    public UpdateJobPeriodValidator()
    {
        RuleFor(x => x.PeriodInSeconds).GreaterThan(0);
    }
}
