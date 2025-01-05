import { api } from '@/api';

import { VerifyEmailRequest } from './email-verification.models';

export const emailVerificationApi = api.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    verifyEmail: builder.mutation<void, VerifyEmailRequest>({
      query: (data) => ({
        url: '/users/verify-email',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (_, error) => (error ? [] : ['Users']),
    }),
  }),
});

export const { useVerifyEmailMutation } = emailVerificationApi;
