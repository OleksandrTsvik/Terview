using FluentValidation;

namespace Api.Options.Validators;

public class JobsOptionsValidator : AbstractValidator<JobsOptions>
{
    public JobsOptionsValidator()
    {
        RuleFor(x => x.DeleteLogsSkipCount).GreaterThan(100);

        RuleFor(x => x.DeleteNotesAfterDays).GreaterThan(0);

        RuleFor(x => x.DeleteProcessedOutboxMessagesAfterDays).GreaterThan(0);
    }
}
