import { api } from '@/api';

import { ResetPasswordRequest } from './reset-password.models';

export const resetPasswordApi = api.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    resetPassword: builder.mutation<void, ResetPasswordRequest>({
      query: (data) => ({
        url: '/users/reset-password',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useResetPasswordMutation } = resetPasswordApi;
