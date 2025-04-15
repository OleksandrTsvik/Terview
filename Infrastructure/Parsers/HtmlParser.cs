using HtmlAgilityPack;

namespace Infrastructure.Parsers;

public class HtmlParser : IHtmlParser
{
    public HashSet<string> GetImageUrls(string html)
    {
        var htmlDoc = new HtmlDocument();
        htmlDoc.LoadHtml(html);

        var imageUrls = htmlDoc.DocumentNode
            .SelectNodes("//img")?
            .Select(img => img.GetAttributeValue("src", string.Empty))
            .Where(src => !string.IsNullOrWhiteSpace(src))
            .ToHashSet();

        return imageUrls ?? [];
    }
}
