import { api } from '@/api';
import { PagedList } from '@/common/pagination.models';

import { GetNotesEditRequest, GetUsersRequest, NoteResponse, UserResponse } from './notes-edit.models';

export const notesEditApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getNotesEdit: builder.query<PagedList<NoteResponse>, GetNotesEditRequest>({
      query: ({ query, tags, createdBy, sort, pageNumber, pageSize }) => ({
        url: '/notes/edit',
        params: {
          q: query,
          t: tags,
          cb: createdBy,
          s: sort,
          p: pageNumber,
          ps: pageSize,
        },
      }),
      providesTags: ['UserSession', 'Notes'],
      transformResponse: (response: PagedList<NoteResponse>) => ({
        ...response,
        items: response.items.map((note) => ({
          ...note,
          isDeleted: !!note.deletedOnUtc || !!note.deletedBy,
        })),
      }),
    }),
    getNotesTags: builder.query<string[], void>({
      query: () => ({
        url: '/notes/tags',
      }),
      providesTags: ['UserSession', 'Notes'],
    }),
    getUsers: builder.query<PagedList<UserResponse>, GetUsersRequest>({
      query: ({ userIds, email }) => ({
        url: '/users',
        params: {
          ids: userIds,
          e: email,
        },
      }),
      providesTags: ['UserSession', 'Users'],
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

export const {
  useGetNotesEditQuery,
  useGetNotesTagsQuery,
  useLazyGetUsersQuery,
  useDeleteNoteMutation,
  useRestoreNoteMutation,
} = notesEditApi;
