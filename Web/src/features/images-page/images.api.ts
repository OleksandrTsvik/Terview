import { api } from '@/api';
import { PagedList, PagingParams } from '@/common/pagination.models';

import { NoteImageResponse } from './images.models';

export const imagesApi = api.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    getNotesImages: builder.query<PagedList<NoteImageResponse>, PagingParams>({
      query: ({ pageNumber, pageSize }) => ({
        url: 'notes/images',
        params: {
          p: pageNumber,
          ps: pageSize,
        },
      }),
      providesTags: ['Notes'],
    }),
    deleteNoteImage: builder.mutation<void, { uniqueImageName: string }>({
      query: ({ uniqueImageName }) => ({
        url: `notes/images/${uniqueImageName}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, error) => (error ? [] : ['Notes']),
    }),
  }),
});

export const { useGetNotesImagesQuery, useDeleteNoteImageMutation } = imagesApi;
