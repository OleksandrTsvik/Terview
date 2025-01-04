import { SortOrder } from 'antd/es/table/interface';

import { stringToSortOrder } from '@/common/type-converters.utils';

export function getColumnSortOrder(
  columnKey: string,
  sortColumn: string | null | undefined,
  sortDirection: string | null | undefined,
): SortOrder {
  return columnKey === sortColumn ? stringToSortOrder(sortDirection) : null;
}
