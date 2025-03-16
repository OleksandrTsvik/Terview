import { api } from '@/api';

import { NoteResponse, UpdateNoteRequest } from './note-edit.models';

export const noteEditApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getNoteEditById: builder.query<NoteResponse, { noteId?: string }>({
      query: ({ noteId }) => ({
        url: `/notes/edit/${noteId}`,
      }),
      providesTags: ['UserSession', 'Notes'],
    }),
    getNotesTags: builder.query<string[], void>({
      query: () => ({
        url: '/notes/tags',
      }),
      providesTags: ['Notes'],
    }),
    updateNote: builder.mutation<void, UpdateNoteRequest>({
      query: ({ noteId, ...data }) => ({
        url: `/notes/${noteId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_, error) => (error ? [] : ['Notes']),
    }),
  }),
});

export const { useGetNoteEditByIdQuery, useGetNotesTagsQuery, useUpdateNoteMutation } = noteEditApi;
