import { api } from '@/api';
import { PagedList } from '@/common/pagination.models';

import { CreateUserRequest, GetUsersRequest, UserResponse } from './users.models';

export const usersApi = api.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    getUsers: builder.query<PagedList<UserResponse>, GetUsersRequest>({
      query: ({ email, sort, sortDirection, pageNumber, pageSize }) => ({
        url: '/users',
        params: {
          e: email,
          s: sort,
          sd: sortDirection,
          p: pageNumber,
          ps: pageSize,
        },
      }),
      providesTags: ['UserSession', 'Users'],
    }),
    createUser: builder.mutation<void, CreateUserRequest>({
      query: (data) => ({
        url: '/users',
        method: 'POST',
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
  }),
});

export const { useGetUsersQuery, useCreateUserMutation, useDeleteUserMutation, useRestoreUserMutation } = usersApi;
