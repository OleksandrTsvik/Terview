using Api.Authentication;
using Domain.Users;
using Microsoft.AspNetCore.Authorization;

namespace Api.Authorization;

public class PermissionAuthorizationHandler : AuthorizationHandler<PermissionRequirement>
{
    private readonly IServiceScopeFactory _serviceScopeFactory;

    public PermissionAuthorizationHandler(IServiceScopeFactory serviceScopeFactory)
    {
        _serviceScopeFactory = serviceScopeFactory;
    }

    protected override async Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        PermissionRequirement requirement)
    {
        Guid userId = context.User.GetUserId();

        using IServiceScope scope = _serviceScopeFactory.CreateScope();
        PermissionProvider permissionProvider = scope.ServiceProvider.GetRequiredService<PermissionProvider>();

        HashSet<string> userPermissions = await permissionProvider.GetPermissionsAsync(userId);

        if (userPermissions.Contains(PermissionType.FullAccess.ToString()) ||
            userPermissions.Any(userPermission => requirement.Permissions.Contains(userPermission)))
        {
            context.Succeed(requirement);
        }
    }
}
