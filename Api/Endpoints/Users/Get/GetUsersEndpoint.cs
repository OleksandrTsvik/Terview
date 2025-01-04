using Api.Extensions;
using Domain.Users;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using SharedKernel;

namespace Api.Endpoints.Users.Get;

public class GetUsersEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("users", Handler)
            .WithTags(Tags.Users)
            .RequireAuthorization();
    }

    public static async Task<Ok<PagedList<UserResponse>>> Handler(
        [FromQuery(Name = "e")] string? email,
        [FromQuery(Name = "s")] string? sort,
        [FromQuery(Name = "sd")] string? sortDirection,
        [FromQuery(Name = "p")] int? pageNumber,
        [FromQuery(Name = "ps")] int? pageSize,
        IMongoCollection<User> usersCollection,
        CancellationToken cancellationToken)
    {
        UserSortType sortType = sort.GetUserSortType();
        SortOrder sortOrder = sortDirection.GetSortOrder();

        PagedList<UserResponse> users = await usersCollection.AsQueryable()
            .WhereIf(
                !string.IsNullOrWhiteSpace(email),
                user => user.Email.ToLower().Contains(email!.ToLower()))
            .QueryIf(
                sortType == UserSortType.Email,
                query => query.SortBy(sortOrder, user => user.Email))
            .QueryIf(
                sortType == UserSortType.CreatedOnUtc,
                query => query.SortBy(sortOrder, user => user.CreatedOnUtc))
            .Select(user => new UserResponse
            {
                Id = user.Id,
                Email = user.Email,
                CreatedOnUtc = user.CreatedOnUtc
            })
            .ToPagedListAsync(pageNumber, pageSize, cancellationToken);

        return TypedResults.Ok(users);
    }
}
