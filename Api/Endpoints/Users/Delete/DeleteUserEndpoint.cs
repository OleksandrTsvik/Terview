using Domain.Users;
using Infrastructure.Authentication;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace Api.Endpoints.Users.Delete;

public class DeleteUserEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapDelete("users/{id:guid}", Handler)
            .WithTags(Tags.Users)
            .HasPermission(PermissionType.DeleteUser);
    }

    public static async Task<Results<NoContent, NotFound>> Handler(
        [FromRoute] Guid id,
        UserContext userContext,
        IMongoCollection<User> usersCollection,
        CancellationToken cancellationToken)
    {
        FilterDefinition<User> filter = Builders<User>.Filter.Eq(user => user.Id, id);

        UpdateDefinition<User> update = Builders<User>.Update
            .Set(user => user.DeletedOnUtc, DateTime.UtcNow)
            .Set(user => user.DeletedBy, userContext.UserId);

        UpdateResult updateResult = await usersCollection.UpdateOneAsync(
            filter,
            update,
            null,
            cancellationToken);

        return updateResult.MatchedCount > 0 ? TypedResults.NoContent() : TypedResults.NotFound();
    }
}
