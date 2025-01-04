import { SortOrder } from 'antd/es/table/interface';

export function stringToNumber(value: string | null, defaultValue: number): number {
  const num = stringToNullableNumber(value);

  return num === null ? defaultValue : num;
}

export function stringToNullableNumber(value: string | null): number | null {
  if (value === null || value === undefined) {
    return null;
  }

  const num = parseFloat(value);

  return isNaN(num) ? null : num;
}

export function stringToBoolean(value: string | null): boolean {
  return value?.trim().toLowerCase() === 'true';
}

export function stringToSortOrder(value: string | undefined | null): SortOrder {
  if (value === null || value === undefined) {
    return null;
  }

  switch (value.toLowerCase()) {
    case 'asc':
    case 'ascend':
      return 'ascend';
    case 'desc':
    case 'descend':
      return 'descend';
    default:
      return null;
  }
}
