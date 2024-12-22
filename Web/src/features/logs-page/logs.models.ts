import { PagedList } from '@/common/pagination.models';

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

export interface GetLogsRequest {
  levels: string[];
  pageNumber: number;
  pageSize: number;
}
