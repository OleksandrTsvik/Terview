using FluentValidation;

namespace Api.Options.Validators;

public class MongoDbOptionsValidator : AbstractValidator<MongoDbOptions>
{
    public MongoDbOptionsValidator()
    {
        RuleFor(x => x.ConnectionString).NotEmpty();

        RuleFor(x => x.DatabaseName).NotEmpty();
    }
}
