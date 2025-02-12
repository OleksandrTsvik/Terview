import { PagingParams } from '@/common/pagination.models';

export interface GetNotesRequest extends PagingParams {
  query?: string | null;
  tags?: string[];
  tagSearchMode?: string | null;
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

export interface GetNotesTagsRequest {
  tags?: string[] | null;
}
