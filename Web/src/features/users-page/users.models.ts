import { PagingParams } from '@/common/pagination.models';

export interface UserResponse {
  id: string;
  email: string;
  createdOnUtc: string;
}

export interface GetUsersRequest extends PagingParams {
  email?: string | null;
  sort?: string | null;
  sortDirection?: string | null;
}

export interface CreateUserRequest {
  email: string;
}
