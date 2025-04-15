import { api } from '@/api';

import { NoteResponse } from './note.models';

export const noteApi = api.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    getNoteBySlug: builder.query<NoteResponse, { noteSlug?: string }>({
      query: ({ noteSlug }) => ({
        url: `/notes/slug/${noteSlug}`,
      }),
      providesTags: ['Notes'],
    }),
  }),
});

export const { useGetNoteBySlugQuery } = noteApi;
