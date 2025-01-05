import { PagingParams } from '@/common/pagination.models';

export interface GetNotesRequest extends PagingParams {
  query?: string | null;
  tags?: string[];
  sort?: string | null;
}

export interface NoteResponse {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdOnUtc: string;
  updatedOnUtc?: string;
}
