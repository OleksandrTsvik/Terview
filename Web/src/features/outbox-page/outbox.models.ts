import { PagedList, PagingParams } from '@/common/pagination.models';

export type GetOutboxMessagesResponse = PagedList<OutboxResponse>;

export interface OutboxResponse {
  id: string;
  type: string;
  content: string;
  occurredOnUtc: string;
  processedOnUtc?: string;
  error?: string;
}

export type GetOutboxMessagesRequest = PagingParams;
