import { PagingParams } from '@/common/pagination.models';

export interface UserResponse {
  id: string;
  email: string;
  emailVerified: boolean;
  createdOnUtc: string;
  deletedOnUtc?: string;
}

export interface GetUsersRequest extends PagingParams {
  email?: string | null;
  sort?: string | null;
  sortDirection?: string | null;
}

export interface CreateUserRequest {
  email: string;
}
