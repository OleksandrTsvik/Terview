import { PagingParams } from '@/common/pagination.models';

export interface GetNotesEditRequest extends PagingParams {
  query?: string | null;
  tags?: string[];
}

export interface NoteResponse {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdOnUtc: string;
  createdBy: string;
  updatedOnUtc?: string;
  updatedBy?: string;
  deletedOnUtc?: string;
  deletedBy?: string;

  isDeleted: boolean;
}
