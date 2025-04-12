namespace Infrastructure.Parsers;

public interface IHtmlParser
{
    HashSet<string> GetImageUrls(string html);
}
