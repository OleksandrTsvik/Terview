using Domain.Users;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace Api.Endpoints.Users.Restore;

public class RestoreUserEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("users/restore/{id:guid}", Handler)
            .WithTags(Tags.Users)
            .HasPermission(PermissionType.RestoreUser);
    }

    public static async Task<Results<NoContent, NotFound>> Handler(
        [FromRoute] Guid id,
        IMongoCollection<User> usersCollection,
        CancellationToken cancellationToken)
    {
        FilterDefinition<User> filter = Builders<User>.Filter.Eq(user => user.Id, id);

        UpdateDefinition<User> update = Builders<User>.Update
            .Set(user => user.DeletedOnUtc, null)
            .Set(user => user.DeletedBy, null);

        UpdateResult updateResult = await usersCollection.UpdateOneAsync(
            filter,
            update,
            null,
            cancellationToken);

        return updateResult.MatchedCount > 0 ? TypedResults.NoContent() : TypedResults.NotFound();
    }
}
