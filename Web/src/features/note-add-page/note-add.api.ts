import { api } from '@/api';

import { CreateNoteRequest } from './note-add.models';

export const noteAddApi = api.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    getNotesTagsFromNoteAddApi: builder.query<string[], void>({
      query: () => ({
        url: '/notes/tags',
      }),
      providesTags: ['Notes'],
    }),
    createNote: builder.mutation<void, CreateNoteRequest>({
      query: (data) => ({
        url: '/notes',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (_, error) => (error ? [] : ['Notes']),
    }),
  }),
});

export const { useGetNotesTagsFromNoteAddApiQuery: useGetNotesTagsQuery, useCreateNoteMutation } = noteAddApi;
