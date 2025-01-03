import { PagedList, PagingParams } from '@/common/pagination.models';

export interface GetLogsResponse extends PagedList<LogResponse> {
  logLevels: string[];
}

export interface LogResponse {
  id: string;
  level: string;
  message: string;
  createdOnUtc: string;
  metadata?: string;
}

export interface GetLogsRequest extends PagingParams {
  levels: string[];
}
