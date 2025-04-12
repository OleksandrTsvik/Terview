using Domain.Users;
using Microsoft.AspNetCore.Http;
using MongoDB.Driver;
using MongoDB.Driver.Linq;

namespace Infrastructure.Authentication;

public class UserContext
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IMongoCollection<User> _usersCollection;

    public UserContext(IHttpContextAccessor httpContextAccessor, IMongoCollection<User> usersCollection)
    {
        _httpContextAccessor = httpContextAccessor;
        _usersCollection = usersCollection;
    }

    public Guid UserId =>
        _httpContextAccessor
            .HttpContext?
            .User
            .GetUserId() ??
        throw new ApplicationException("User context is unavailable.");

    public bool IsAuthenticated =>
        _httpContextAccessor
            .HttpContext?
            .User
            .Identity?
            .IsAuthenticated ?? false;

    public async Task<List<PermissionType>> GetUserPermissionsAsync()
    {
        List<PermissionType>? permissions = await _usersCollection
            .Find(user =>
                user.Id == UserId &&
                user.DeletedOnUtc == null &&
                user.DeletedBy == null)
            .Project(user => user.Permissions)
            .FirstOrDefaultAsync();

        if (permissions is null)
        {
            return [];
        }

        return permissions;
    }
}
