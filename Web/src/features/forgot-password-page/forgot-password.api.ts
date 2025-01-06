import { api } from '@/api';

export const forgotPasswordApi = api.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    forgotPassword: builder.mutation<void, { email: string }>({
      query: (data) => ({
        url: '/users/forgot-password',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useForgotPasswordMutation } = forgotPasswordApi;
