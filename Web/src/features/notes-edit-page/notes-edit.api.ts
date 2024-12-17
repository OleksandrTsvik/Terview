import { api } from '@/api';
import { PagedList } from '@/common/pagination.models';

import { GetEditNotesRequest, NoteResponse } from './notes-edit.models';

export const notesEditApi = api.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    getEditNotes: builder.query<PagedList<NoteResponse>, GetEditNotesRequest>({
      query: ({ query, tags, pageNumber, pageSize }) => ({
        url: '/notes/edit',
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

export const { useGetEditNotesQuery, useGetNotesTagsQuery } = notesEditApi;
