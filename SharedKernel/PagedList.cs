namespace SharedKernel;

public class PagedList<T>
{
    private const int FirstPageNumber = 1;

    public List<T> Items { get; }
    public int CurrentPage { get; }
    public int TotalPages { get; }
    public int PageSize { get; }
    public int TotalItems { get; }

    public bool HasPreviousPage => CurrentPage > FirstPageNumber;
    public bool HasNextPage => CurrentPage < TotalPages;

    public PagedList(List<T> items, int totalItems, int pageNumber, int pageSize)
    {
        Items = items;
        TotalItems = totalItems;
        CurrentPage = pageNumber;
        PageSize = pageSize;
        TotalPages = (int)Math.Ceiling(totalItems / (double)pageSize);
    }
}
