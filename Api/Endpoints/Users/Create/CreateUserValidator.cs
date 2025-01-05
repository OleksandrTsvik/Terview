using Domain.Users;
using FluentValidation;
using MongoDB.Driver;
using MongoDB.Driver.Linq;

namespace Api.Endpoints.Users.Create;

public class CreateUserValidator : AbstractValidator<CreateUserRequest>
{
    public CreateUserValidator(IMongoCollection<User> usersCollection)
    {
        RuleFor(x => x.Email)
            .EmailAddress()
            .MaximumLength(UserRules.MaxEmailLength)
            .MustAsync(async (email, cancellationToken) =>
            {
                bool emailExists = await usersCollection.AsQueryable()
                    .AnyAsync(user => user.Email == email, cancellationToken);

                return !emailExists;
            })
            .WithMessage("The email must be unique.");
    }
}
