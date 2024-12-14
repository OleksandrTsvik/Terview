import { api } from '@/api';
import { PagedList } from '@/common/pagination.models';

import { GetNotesRequest, NoteResponse } from './notes.models';

export const notesApi = api.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    getNotes: builder.query<PagedList<NoteResponse>, GetNotesRequest>({
      query: ({ query, tags, pageNumber, pageSize }) => ({
        url: '/notes',
        params: {
          q: query,
          t: tags,
          p: pageNumber,
          ps: pageSize,
        },
      }),
      providesTags: ['Notes'],
    }),
    getNotesTags: builder.query<string[], void>({
      query: () => ({
        url: '/notes/tags',
      }),
      providesTags: ['Notes'],
    }),
  }),
});

export const { useGetNotesQuery, useGetNotesTagsQuery } = notesApi;
