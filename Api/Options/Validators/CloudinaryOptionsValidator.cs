using FluentValidation;
using Infrastructure.Options;

namespace Api.Options.Validators;

public class CloudinaryOptionsValidator : AbstractValidator<CloudinaryOptions>
{
    public CloudinaryOptionsValidator()
    {
        RuleFor(x => x.CloudName).NotEmpty();

        RuleFor(x => x.ApiKey).NotEmpty();

        RuleFor(x => x.ApiSecret).NotEmpty();
    }
}
