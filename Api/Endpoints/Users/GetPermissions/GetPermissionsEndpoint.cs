using Api.Extensions;
using Domain.Users;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Api.Endpoints.Users.GetPermissions;

public class GetPermissionsEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("users/permissions", Handler)
            .WithTags(Tags.Users)
            .HasPermission(
                PermissionType.ReadUserPermission,
                PermissionType.CreateUser,
                PermissionType.ReadUser,
                PermissionType.UpdateUserPermission);
    }

    public static Ok<string[]> Handler(
        CancellationToken cancellationToken)
    {
        return TypedResults.Ok(Enum.GetNames<PermissionType>());
    }
}
