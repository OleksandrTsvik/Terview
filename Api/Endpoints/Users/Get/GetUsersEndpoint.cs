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
            .HasPermission(PermissionType.ReadUser);
    }

    public static async Task<Ok<PagedList<UserResponse>>> Handler(
        [FromQuery(Name = "ids")] Guid[]? ids,
        [FromQuery(Name = "e")] string? email,
        [FromQuery(Name = "pe")] PermissionType[]? permissions,
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
                ids?.Length > 0,
                user => ids!.Contains(user.Id))
            .WhereIf(
                !string.IsNullOrWhiteSpace(email),
                user => user.Email.ToLower().Contains(email!.ToLower()))
            .WhereIf(
                permissions?.Length > 0,
                user => permissions!.All(permission => user.Permissions.Contains(permission)))
            .OrderBy(note => note.DeletedOnUtc)
            .QueryIf(
                sortType == UserSortType.Email,
                query => query.ThenSortBy(sortOrder, user => user.Email))
            .QueryIf(
                sortType == UserSortType.CreatedOnUtc,
                query => query.ThenSortBy(sortOrder, user => user.CreatedOnUtc))
            .Select(user => new UserResponse
            {
                Id = user.Id,
                Email = user.Email,
                EmailVerified = user.EmailVerified,
                Permissions = user.Permissions,
                CreatedOnUtc = user.CreatedOnUtc,
                DeletedOnUtc = user.DeletedOnUtc,
            })
            .ToPagedListAsync(pageNumber, pageSize, cancellationToken);

        return TypedResults.Ok(users);
    }
}
