using FluentValidation;

namespace Api.Endpoints.Users.UpdatePermissions;

public class UpdateUserPermissionsValidator : AbstractValidator<UpdateUserPermissionsRequest>
{
    public UpdateUserPermissionsValidator()
    {
        RuleFor(x => x.Permissions)
            .NotNull()
            .ForEach(permission => permission.IsInEnum());
    }
}
