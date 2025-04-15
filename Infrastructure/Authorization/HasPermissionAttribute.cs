using Domain.Users;
using Microsoft.AspNetCore.Authorization;

namespace Infrastructure.Authorization;

public class HasPermissionAttribute : AuthorizeAttribute
{
    public const string PolicyPrefix = "PERMISSION:";

    public HasPermissionAttribute(params PermissionType[] permissions)
    {
        Policy = $"{PolicyPrefix}{string.Join(",", permissions)}";
    }
}
