using System.Linq.Expressions;
using MongoDB.Driver.Linq;
using SharedKernel;

namespace Api.Extensions;

public static class QueryableExtensions
{
    public static async Task<PagedList<T>> ToPagedListAsync<T>(
        this IQueryable<T> query,
        int? pageNumber,
        int? pageSize,
        int? maxPageSize,
        CancellationToken cancellationToken = default)
    {
        var pagingParams = new PagingParams(pageNumber, pageSize, maxPageSize);

        int totalItems = await query.CountAsync(cancellationToken);
        int totalPages = (int)Math.Ceiling(totalItems / (double)pagingParams.PageSize);

        if (pagingParams.PageNumber > totalPages)
        {
            pagingParams.PageNumber = totalPages;
        }

        List<T> items = await query
            .Skip((pagingParams.PageNumber - 1) * pagingParams.PageSize)
            .Take(pagingParams.PageSize)
            .ToListAsync(cancellationToken);

        return new PagedList<T>(items, totalItems, pagingParams.PageNumber, pagingParams.PageSize);
    }

    public static Task<PagedList<T>> ToPagedListAsync<T>(
        this IQueryable<T> query,
        int? pageNumber,
        int? pageSize,
        CancellationToken cancellationToken = default)
    {
        return query.ToPagedListAsync(
            pageNumber,
            pageSize,
            null,
            cancellationToken);
    }

    public static IQueryable<TSource> SortBy<TSource, TKey>(
        this IQueryable<TSource> query,
        SortOrder? sortOrder,
        Expression<Func<TSource, TKey>> keySelector) =>
        sortOrder switch
        {
            SortOrder.Desc or SortOrder.Descend => query.OrderByDescending(keySelector),
            _ => query.OrderBy(keySelector),
        };

    public static IQueryable<T> WhereIf<T>(
        this IQueryable<T> query,
        bool condition,
        Expression<Func<T, bool>> predicate)
    {
        return condition ? query.Where(predicate) : query;
    }
}
