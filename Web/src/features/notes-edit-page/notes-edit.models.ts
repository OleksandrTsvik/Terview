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
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
  deletedAt?: Date;
  deletedBy?: string;

  isDeleted: boolean;
}
