using Domain.Users;
using Microsoft.AspNetCore.Http.HttpResults;
using MongoDB.Driver;

namespace Api.Endpoints.Users.UpdatePermissions;

public class UpdateUserPermissionsEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPatch("users/permissions/{userId:guid}", Handler)
            .WithRequestValidation<UpdateUserPermissionsRequest>()
            .WithTags(Tags.Users)
            .HasPermission(PermissionType.UpdateUserPermission);
    }

    public static async Task<Results<NoContent, NotFound>> Handler(
        Guid userId,
        UpdateUserPermissionsRequest request,
        IMongoCollection<User> usersCollection,
        CancellationToken cancellationToken)
    {
        FilterDefinitionBuilder<User> filterBuilder = Builders<User>.Filter;
        FilterDefinition<User> filter = filterBuilder.And(
            filterBuilder.Eq(user => user.Id, userId),
            filterBuilder.Eq(user => user.DeletedOnUtc, null),
            filterBuilder.Eq(user => user.DeletedBy, null));

        UpdateDefinition<User> update = Builders<User>.Update
            .Set(user => user.Permissions, request.Permissions);

        UpdateResult updateResult = await usersCollection.UpdateOneAsync(
            filter,
            update,
            null,
            cancellationToken);

        return updateResult.MatchedCount > 0 ? TypedResults.NoContent() : TypedResults.NotFound();
    }
}
