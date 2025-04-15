using Microsoft.AspNetCore.Authorization;

namespace Infrastructure.Authorization;

public class PermissionRequirement : IAuthorizationRequirement
{
    public string[] Permissions { get; }

    public PermissionRequirement(string[] permissions)
    {
        Permissions = permissions;
    }
}
