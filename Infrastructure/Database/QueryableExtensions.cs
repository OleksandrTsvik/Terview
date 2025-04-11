using System.Linq.Expressions;
using MongoDB.Driver.Linq;
using SharedKernel;

namespace Infrastructure.Database;

public static class QueryableExtensions
{
    public static IQueryable<T> QueryIf<T>(
        this IQueryable<T> query,
        bool condition,
        Func<IQueryable<T>, IQueryable<T>> request)
    {
        return condition ? request(query) : query;
    }

    public static IOrderedQueryable<T> QueryIf<T>(
        this IOrderedQueryable<T> orderedQuery,
        bool condition,
        Func<IOrderedQueryable<T>, IOrderedQueryable<T>> request)
    {
        return condition ? request(orderedQuery) : orderedQuery;
    }

    public static IQueryable<T> WhereIf<T>(
        this IQueryable<T> query,
        bool condition,
        Expression<Func<T, bool>> predicate)
    {
        return condition ? query.Where(predicate) : query;
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

    public static IQueryable<TSource> SortBy<TSource, TKey>(
        this IQueryable<TSource> query,
        SortOrder? sortOrder,
        Expression<Func<TSource, TKey>> keySelector) =>
        sortOrder switch
        {
            SortOrder.Desc or SortOrder.Descend => query.OrderByDescending(keySelector),
            _ => query.OrderBy(keySelector),
        };

    public static IOrderedQueryable<TSource> ThenSortBy<TSource, TKey>(
        this IOrderedQueryable<TSource> orderedQuery,
        SortOrder? sortOrder,
        Expression<Func<TSource, TKey>> keySelector) =>
        sortOrder switch
        {
            SortOrder.Desc or SortOrder.Descend => orderedQuery.ThenByDescending(keySelector),
            _ => orderedQuery.ThenBy(keySelector),
        };
}
