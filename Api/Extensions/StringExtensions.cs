using Domain.Notes;
using Domain.Users;
using SharedKernel;

namespace Api.Extensions;

public static class StringExtensions
{
    public static SortOrder GetSortOrder(this string? sortDirection) =>
        sortDirection?.Trim().ToLower() switch
        {
            "desc" or "descend" => SortOrder.Desc,
            _ => SortOrder.Asc
        };

    public static NoteSortType GetNoteSortType(this string? sortBy) =>
        sortBy?.Trim().ToLower() switch
        {
            "date" => NoteSortType.Date,
            _ => NoteSortType.Alphabet
        };

    public static NoteTagSearchType GetNoteTagSearchType(this string? sortBy) =>
        sortBy?.Trim().ToLower() switch
        {
            "any" => NoteTagSearchType.Any,
            _ => NoteTagSearchType.All
        };

    public static UserSortType GetUserSortType(this string? sortBy) =>
        sortBy?.Trim().ToLower() switch
        {
            "date" => UserSortType.CreatedOnUtc,
            _ => UserSortType.Email
        };
}
