import { api } from '@/api';
import { PagedList } from '@/common/pagination.models';

import { GetNotesRequest, GetNotesTagsRequest, NoteResponse } from './notes.models';

export const notesApi = api.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    getNotes: builder.query<PagedList<NoteResponse>, GetNotesRequest>({
      query: ({ query, tags, tagSearchMode, sort, pageNumber, pageSize }) => ({
        url: '/notes',
        params: {
          q: query,
          t: tags,
          tm: tagSearchMode,
          s: sort,
          p: pageNumber,
          ps: pageSize,
        },
      }),
      providesTags: ['Notes'],
    }),
    getNotesTags: builder.query<string[], GetNotesTagsRequest>({
      query: ({ tags }) => ({
        url: '/notes/tags',
        params: {
          t: tags,
        },
      }),
      providesTags: ['Notes'],
    }),
  }),
});

export const { useGetNotesQuery, useGetNotesTagsQuery } = notesApi;
