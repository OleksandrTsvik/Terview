import { api } from '@/api';

import { MongoDbResponse } from './mongodb.models';

export const mongoDbApi = api.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    getMongoDbDashboard: builder.query<MongoDbResponse, void>({
      query: () => ({
        url: '/dashboard/mongodb',
      }),
      providesTags: ['UserSession'],
      transformResponse: (response: MongoDbResponse) => ({
        ...response,
        collections: response.collections.map((collection) => ({
          ...collection,
          storageSizeInMegabytes: +collection.storageSizeInMegabytes.toFixed(2),
        })),
      }),
    }),
  }),
});

export const { useGetMongoDbDashboardQuery } = mongoDbApi;
