import { PagingParams } from '@/common/pagination.models';

export interface GetNotesEditRequest extends PagingParams {
  query?: string | null;
  tags?: string[];
  createdBy?: string | null;
  sort?: string | null;
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

export interface UserResponse {
  id: string;
  email: string;
  emailVerified: boolean;
  permissions: string[];
  createdOnUtc: string;
  deletedOnUtc?: string;
}

export interface GetUsersRequest {
  userIds?: string[] | null;
  email?: string | null;
}
