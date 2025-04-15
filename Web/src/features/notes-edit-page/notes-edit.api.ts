import { api } from '@/api';
import { PagedList } from '@/common/pagination.models';

import {
  GetNotesEditRequest,
  GetNotesTagsRequest,
  GetUsersRequest,
  NoteResponse,
  UserResponse,
} from './notes-edit.models';

export const notesEditApi = api.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    getNotesEdit: builder.query<PagedList<NoteResponse>, GetNotesEditRequest>({
      query: ({ query, tags, tagSearchMode, createdBy, sort, pageNumber, pageSize }) => ({
        url: '/notes/edit',
        params: {
          q: query,
          t: tags,
          tm: tagSearchMode,
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
    getNotesTagsFromNotesEditApi: builder.query<string[], GetNotesTagsRequest>({
      query: ({ tags }) => ({
        url: '/notes/tags',
        params: {
          t: tags,
        },
      }),
      providesTags: ['UserSession', 'Notes'],
    }),
    getUsersFromNotesEditApi: builder.query<PagedList<UserResponse>, GetUsersRequest>({
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
  useGetNotesTagsFromNotesEditApiQuery: useGetNotesTagsQuery,
  useLazyGetUsersFromNotesEditApiQuery: useLazyGetUsersQuery,
  useDeleteNoteMutation,
  useRestoreNoteMutation,
} = notesEditApi;
