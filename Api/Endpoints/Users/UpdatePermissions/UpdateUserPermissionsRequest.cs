using Domain.Users;

namespace Api.Endpoints.Users.UpdatePermissions;

public record UpdateUserPermissionsRequest(List<PermissionType> Permissions);
