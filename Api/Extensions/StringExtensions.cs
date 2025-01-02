using Domain.Notes;

namespace Api.Extensions;

public static class StringExtensions
{
    public static NoteSortType GetNoteSortType(this string? sort) =>
        sort?.ToLower() switch
        {
            "date" => NoteSortType.Date,
            _ => NoteSortType.Alphabet
        };
}
