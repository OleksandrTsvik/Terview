import { api } from '@/api';

import { HealthResponse } from './health.models';

export const healthApi = api.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    healthCheck: builder.query<HealthResponse, void>({
      query: () => ({
        url: '/_health',
      }),
      providesTags: ['UserSession'],
    }),
  }),
});

export const { useHealthCheckQuery } = healthApi;
