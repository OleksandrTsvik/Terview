import { PagingParams } from '@/common/pagination.models';

export interface GetNotesRequest extends PagingParams {
  query?: string | null;
  tags?: string[];
}

export interface NoteResponse {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt?: Date;
}
