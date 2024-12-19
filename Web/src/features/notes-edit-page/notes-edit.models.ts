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
  createdOnUtc: Date;
  createdBy: string;
  updatedOnUtc?: Date;
  updatedBy?: string;
  deletedOnUtc?: Date;
  deletedBy?: string;

  isDeleted: boolean;
}
