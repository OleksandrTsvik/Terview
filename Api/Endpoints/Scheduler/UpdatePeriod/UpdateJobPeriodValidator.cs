using FluentValidation;
using Infrastructure.Scheduler;

namespace Api.Endpoints.Scheduler.UpdatePeriod;

public class UpdateJobPeriodValidator : AbstractValidator<UpdateJobPeriodRequest>
{
    public UpdateJobPeriodValidator()
    {
        RuleFor(x => x.CronExpression)
            .NotEmpty()
            .Must(cronExpression => CronExpressionHelper.IsValidCronExpression(cronExpression))
            .WithMessage("Invalid cron expression.");
    }
}
