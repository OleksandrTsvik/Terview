using Domain.Users;

namespace Infrastructure.Authorization;

public static class PermissionTypeExtensions
{
    public static bool ContainsPermission(
        this IEnumerable<PermissionType> permissionTypes,
        params PermissionType[] permissions)
    {
        return permissionTypes.Contains(PermissionType.FullAccess) ||
            permissions.Any(permission => permissionTypes.Contains(permission));
    }

    public static bool ContainsPermission(
        this IEnumerable<string> permissionTypes,
        params string[] permissions)
    {
        return permissionTypes.Contains(PermissionType.FullAccess.ToString()) ||
            permissions.Any(permission => permissionTypes.Contains(permission));
    }
}
