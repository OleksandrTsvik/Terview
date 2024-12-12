export interface PagedList<T> {
  items: T[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PagingParams {
  pageNumber?: number;
  pageSize?: number;
}
