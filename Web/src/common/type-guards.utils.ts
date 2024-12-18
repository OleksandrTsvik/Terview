export function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isObject(value: unknown): value is object {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isArrayOfStrings(value: unknown): value is string[] {
  return isArrayOf<string>(value, isString);
}

export function isArrayOf<T>(value: unknown, check: (val: unknown) => val is T): value is T[] {
  return Array.isArray(value) && value.every(check);
}
