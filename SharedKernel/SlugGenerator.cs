using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;

namespace SharedKernel;

public static partial class SlugGenerator
{
    private const string DefaultSlugSeparator = "-";

    [GeneratedRegex(@"[^a-z0-9\s-]")]
    private static partial Regex InvalidSlugCharactersRegex();

    [GeneratedRegex(@"\s+")]
    private static partial Regex WhitespaceRegex();

    public static string GenerateSlug(this string value, string separator = DefaultSlugSeparator)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return string.Empty;
        }

        string slug = value.ToLowerInvariant();

        slug = RemoveDiacritics(slug);
        slug = TransliterateCyrillicToLatin(slug);

        slug = InvalidSlugCharactersRegex().Replace(slug, string.Empty);
        slug = WhitespaceRegex().Replace(slug, separator);

        string escapedSeparator = Regex.Escape(separator);
        slug = Regex.Replace(slug, $"{escapedSeparator}+", separator);

        slug = slug.Trim(separator.ToCharArray());

        return slug;
    }

    public static bool IsValidSlug(this string? slug, string separator = DefaultSlugSeparator)
    {
        if (string.IsNullOrWhiteSpace(slug))
        {
            return false;
        }

        string escapedSeparator = Regex.Escape(separator);
        string pattern = $"^[a-z0-9-{escapedSeparator}]+$";

        return Regex.IsMatch(slug, pattern);
    }

    private static string RemoveDiacritics(string text)
    {
        string normalizedString = text.Normalize(NormalizationForm.FormD);

        var stringBuilder = new StringBuilder(normalizedString.Length);

        foreach (char character in normalizedString)
        {
            UnicodeCategory unicodeCategory = CharUnicodeInfo.GetUnicodeCategory(character);

            if (unicodeCategory != UnicodeCategory.NonSpacingMark)
            {
                stringBuilder.Append(character);
            }
        }

        return stringBuilder.ToString().Normalize(NormalizationForm.FormC);
    }

    private static string TransliterateCyrillicToLatin(string text)
    {
        var stringBuilder = new StringBuilder(text.Length);

        foreach (char character in text)
        {
            if (CyrillicToLatinMap.TryGetValue(character, out string? latin))
            {
                stringBuilder.Append(latin);
            }
            else
            {
                stringBuilder.Append(character);
            }
        }

        return stringBuilder.ToString();
    }

    private static readonly Dictionary<char, string> CyrillicToLatinMap = new()
    {
        ['а'] = "a",
        ['б'] = "b",
        ['в'] = "v",
        ['г'] = "g",
        ['д'] = "d",
        ['е'] = "e",
        ['ё'] = "yo",
        ['ж'] = "zh",
        ['з'] = "z",
        ['и'] = "i",
        ['й'] = "y",
        ['к'] = "k",
        ['л'] = "l",
        ['м'] = "m",
        ['н'] = "n",
        ['о'] = "o",
        ['п'] = "p",
        ['р'] = "r",
        ['с'] = "s",
        ['т'] = "t",
        ['у'] = "u",
        ['ф'] = "f",
        ['х'] = "kh",
        ['ц'] = "ts",
        ['ч'] = "ch",
        ['ш'] = "sh",
        ['щ'] = "shch",
        ['ъ'] = "",
        ['ы'] = "y",
        ['ь'] = "",
        ['э'] = "e",
        ['ю'] = "yu",
        ['я'] = "ya",

        ['ґ'] = "g",
        ['є'] = "ye",
        ['і'] = "i",
        ['ї'] = "yi",
    };
}
