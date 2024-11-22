namespace SharedKernel;

public class PagingParams
{
    private const int DefaultPageNumber = 1;
    private const int DefaultPageSize = 20;
    private const int DefaultMaxPageSize = 100;

    private int _pageNumber;
    private int _pageSize;
    private int _maxPageSize;

    public PagingParams(
        int? pageNumber = DefaultPageNumber,
        int? pageSize = DefaultPageSize,
        int? maxPageSize = DefaultMaxPageSize)
    {
        MaxPageSize = maxPageSize ?? DefaultMaxPageSize;

        PageNumber = pageNumber ?? DefaultPageNumber;
        PageSize = pageSize ?? DefaultPageSize;
    }

    public int PageNumber
    {
        get => _pageNumber;
        set => _pageNumber = (value > 0) ? value : DefaultPageNumber;
    }

    public int PageSize
    {
        get => _pageSize;
        set
        {
            if (value <= 0)
            {
                _pageSize = DefaultPageSize;
            }
            else if (value > _maxPageSize)
            {
                _pageSize = _maxPageSize;
            }
            else
            {
                _pageSize = value;
            }
        }
    }

    public int MaxPageSize
    {
        get => _maxPageSize;
        set => _maxPageSize = (value > 0) ? value : DefaultMaxPageSize;
    }
}
