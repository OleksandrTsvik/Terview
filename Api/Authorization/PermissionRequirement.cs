using Microsoft.AspNetCore.Authorization;

namespace Api.Authorization;

public class PermissionRequirement : IAuthorizationRequirement
{
    public string[] Permissions { get; }

    public PermissionRequirement(string[] permissions)
    {
        Permissions = permissions;
    }
}
