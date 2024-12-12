import { GetNotesRequest, NoteResponse } from './notes.models';
import { api } from '../../api';
import { PagedList } from '../../common/pagination.models';

export const notesApi = api.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    getNotes: builder.query<PagedList<NoteResponse>, GetNotesRequest>({
      query: (params) => ({
        url: '/notes',
        params,
      }),
      providesTags: ['Notes'],
    }),
  }),
});

export const { useGetNotesQuery } = notesApi;
