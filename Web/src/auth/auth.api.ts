import { api } from '@/api';

import { LoginRequest, LoginResponse, LogoutRequest, RefreshTokenRequest, RefreshTokenResponse } from './auth.models';

export const authApi = api.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (data) => ({
        url: '/users/login',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (_, error) => (error ? [] : ['UserSession']),
    }),
    refreshToken: builder.mutation<RefreshTokenResponse, RefreshTokenRequest>({
      query: (data) => ({
        url: '/users/refresh-token',
        method: 'POST',
        body: data,
      }),
    }),
    logout: builder.mutation<void, LogoutRequest>({
      query: (data) => ({
        url: '/users/logout',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useLoginMutation, useRefreshTokenMutation, useLogoutMutation } = authApi;
