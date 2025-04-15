import { isObject, isString } from '@/common/type-guards.utils';

import { HealthErrorResponse } from './health.models';

export function isHealthErrorResponse(value: unknown): value is HealthErrorResponse {
  if (!isObject(value) || !('data' in value) || !isObject(value.data)) {
    return false;
  }

  return (
    'status' in value.data &&
    isString(value.data.status) &&
    'totalDuration' in value.data &&
    isString(value.data.totalDuration) &&
    'entries' in value.data &&
    isObject(value.data.entries)
  );
}
