using Api.Authentication;
using Api.Extensions;
using Domain.Users;
using Microsoft.AspNetCore.Http.HttpResults;
using MongoDB.Driver;

namespace Api.Endpoints.Users.Logout;

public class LogoutEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("users/logout", Handler)
            .WithRequestValidation<LogoutRequest>()
            .WithTags(Tags.Users)
            .RequireAuthorization();
    }

    public static async Task<Results<NoContent, BadRequest>> Handler(
        LogoutRequest request,
        UserContext userContext,
        IMongoCollection<RefreshToken> refreshTokensCollection,
        CancellationToken cancellationToken)
    {
        DeleteResult deleteResult = await refreshTokensCollection.DeleteOneAsync(
            refreshToken =>
                refreshToken.UserId == userContext.UserId &&
                refreshToken.Token == request.RefreshToken,
            cancellationToken);

        return deleteResult.DeletedCount > 0 ? TypedResults.NoContent() : TypedResults.BadRequest();
    }
}
