import { api } from '@/api';

import { GetLogsRequest, GetLogsResponse } from './logs.models';

export const logsApi = api.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    getLogs: builder.query<GetLogsResponse, GetLogsRequest>({
      query: ({ levels, pageNumber, pageSize }) => ({
        url: '/logs',
        params: {
          l: levels,
          p: pageNumber,
          ps: pageSize,
        },
      }),
      providesTags: ['UserSession'],
    }),
  }),
});

export const { useGetLogsQuery } = logsApi;
