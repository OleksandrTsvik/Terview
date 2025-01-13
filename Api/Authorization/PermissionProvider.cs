using Domain.Users;
using MongoDB.Driver;
using MongoDB.Driver.Linq;

namespace Api.Authorization;

public class PermissionProvider
{
    private readonly IMongoCollection<User> _usersCollection;

    public PermissionProvider(IMongoCollection<User> usersCollection)
    {
        _usersCollection = usersCollection;
    }

    public async Task<List<PermissionType>> GetPermissionsAsync(Guid userId)
    {
        List<PermissionType>? permissions = await _usersCollection.AsQueryable()
            .Where(user =>
                user.Id == userId &&
                user.DeletedOnUtc == null &&
                user.DeletedBy == null)
            .Select(user => user.Permissions)
            .FirstOrDefaultAsync();

        if (permissions is null)
        {
            return [];
        }

        return permissions;
    }

    public async Task<HashSet<string>> GetPermissionNamesAsync(Guid userId)
    {
        List<PermissionType> permissions = await GetPermissionsAsync(userId);

        return permissions
            .Select(permissionType => permissionType.ToString())
            .ToHashSet();
    }
}
