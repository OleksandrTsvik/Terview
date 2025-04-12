import { api } from '@/api';
import { PagedList } from '@/common/pagination.models';

import { GetNotesTagsEditRequest, UpdateNotesTagRequest } from './tags.models';

export const tagsApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getNotesTagsEdit: builder.query<PagedList<string>, GetNotesTagsEditRequest>({
      query: ({ query, pageNumber, pageSize }) => ({
        url: '/notes/tags/edit',
        params: {
          q: query,
          p: pageNumber,
          ps: pageSize,
        },
      }),
      providesTags: ['Notes'],
    }),
    updateNotesTag: builder.mutation<void, UpdateNotesTagRequest>({
      query: (data) => ({
        url: '/notes/tags',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_, error) => (error ? [] : ['Notes']),
    }),
    deleteNotesTag: builder.mutation<void, { tag: string }>({
      query: ({ tag }) => ({
        url: `/notes/tags/${tag}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, error) => (error ? [] : ['Notes']),
    }),
  }),
});

export const { useGetNotesTagsEditQuery, useUpdateNotesTagMutation, useDeleteNotesTagMutation } = tagsApi;
