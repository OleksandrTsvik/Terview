using FluentValidation;

namespace Api.Options;

public class MongoDbOptionsValidator : AbstractValidator<MongoDbOptions>
{
    public MongoDbOptionsValidator()
    {
        RuleFor(x => x.ConnectionString).NotEmpty();

        RuleFor(x => x.DatabaseName).NotEmpty();
    }
}
