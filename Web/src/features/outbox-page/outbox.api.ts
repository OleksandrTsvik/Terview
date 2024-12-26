import { api } from '@/api';

import { GetOutboxMessagesRequest, GetOutboxMessagesResponse } from './outbox.models';

export const outboxApi = api.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    getOutboxMessages: builder.query<GetOutboxMessagesResponse, GetOutboxMessagesRequest>({
      query: ({ pageNumber, pageSize }) => ({
        url: '/outbox',
        params: {
          p: pageNumber,
          ps: pageSize,
        },
      }),
      providesTags: ['UserSession', 'OutboxMessages'],
    }),
    runEvent: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/outbox/${id}`,
        method: 'POST',
      }),
      invalidatesTags: (_, error) => (error ? [] : ['OutboxMessages']),
    }),
  }),
});

export const { useGetOutboxMessagesQuery, useRunEventMutation } = outboxApi;
