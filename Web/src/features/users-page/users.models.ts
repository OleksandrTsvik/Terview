import { PagingParams } from '@/common/pagination.models';

export interface UsersState {
  selectedUpdateUserPermissions: UserResponse | null;
}

export interface UserResponse {
  id: string;
  email: string;
  emailVerified: boolean;
  permissions: string[];
  createdOnUtc: string;
  deletedOnUtc?: string;
}

export interface GetUsersRequest extends PagingParams {
  email?: string | null;
  permissions: string[];
  sort?: string | null;
  sortDirection?: string | null;
}

export interface CreateUserRequest {
  email: string;
}

export interface UpdateUserPermissionsRequest {
  userId: string;
  permissions: string[];
}
