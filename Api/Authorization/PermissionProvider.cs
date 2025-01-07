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

    public async Task<HashSet<string>> GetPermissionsAsync(Guid userId)
    {
        List<PermissionType> permissions = await _usersCollection.AsQueryable()
            .Where(user => user.Id == userId)
            .Select(user => user.Permissions)
            .FirstOrDefaultAsync();

        return permissions
            .Select(permissionType => permissionType.ToString())
            .ToHashSet();
    }
}
