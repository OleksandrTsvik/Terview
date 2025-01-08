import { api } from '@/api';
import { PagedList } from '@/common/pagination.models';

import { CreateUserRequest, GetUsersRequest, UpdateUserPermissionsRequest, UserResponse } from './users.models';

export const usersApi = api.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    getUsers: builder.query<PagedList<UserResponse>, GetUsersRequest>({
      query: ({ email, permissions, sort, sortDirection, pageNumber, pageSize }) => ({
        url: '/users',
        params: {
          e: email,
          pe: permissions,
          s: sort,
          sd: sortDirection,
          p: pageNumber,
          ps: pageSize,
        },
      }),
      providesTags: ['UserSession', 'Users'],
    }),
    getPermissions: builder.query<string[], void>({
      query: () => ({
        url: '/users/permissions',
      }),
    }),
    createUser: builder.mutation<void, CreateUserRequest>({
      query: (data) => ({
        url: '/users',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (_, error) => (error ? [] : ['Users']),
    }),
    updateUserPermissions: builder.mutation<void, UpdateUserPermissionsRequest>({
      query: ({ userId, ...data }) => ({
        url: `/users/permissions/${userId}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_, error) => (error ? [] : ['Users']),
    }),
    deleteUser: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, error) => (error ? [] : ['Users']),
    }),
    restoreUser: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/users/restore/${id}`,
        method: 'POST',
      }),
      invalidatesTags: (_, error) => (error ? [] : ['Users']),
    }),
    resendVerificationEmail: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/users/resend-verification-email/${id}`,
        method: 'POST',
      }),
      invalidatesTags: (_, error) => (error ? [] : ['Users']),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetPermissionsQuery,
  useCreateUserMutation,
  useUpdateUserPermissionsMutation,
  useDeleteUserMutation,
  useRestoreUserMutation,
  useResendVerificationEmailMutation,
} = usersApi;
