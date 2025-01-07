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

    public Task<List<PermissionType>> GetPermissionsAsync(Guid userId)
    {
        return _usersCollection.AsQueryable()
            .Where(user => user.Id == userId)
            .Select(user => user.Permissions)
            .FirstOrDefaultAsync();
    }

    public async Task<HashSet<string>> GetPermissionNamesAsync(Guid userId)
    {
        List<PermissionType> permissions = await GetPermissionsAsync(userId);

        return permissions
            .Select(permissionType => permissionType.ToString())
            .ToHashSet();
    }
}
