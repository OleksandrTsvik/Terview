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
      transformResponse: (response: PagedList<NoteResponse>) => ({
        ...response,
        items: response.items.map((note) => ({
          ...note,
          isDeleted: !!note.deletedAt || !!note.deletedBy,
        })),
      }),
    }),
    getNotesTags: builder.query<string[], void>({
      query: () => ({
        url: '/notes/tags',
      }),
      providesTags: ['Notes'],
    }),
    deleteNote: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/notes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, error) => (error ? [] : ['Notes']),
    }),
    restoreNote: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/notes/restore/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: (_, error) => (error ? [] : ['Notes']),
    }),
  }),
});

export const { useGetEditNotesQuery, useGetNotesTagsQuery, useDeleteNoteMutation, useRestoreNoteMutation } =
  notesEditApi;
