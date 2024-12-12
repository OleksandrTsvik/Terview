import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { API_URL } from '../common/node-env.constants';

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: API_URL, credentials: 'include' }),
  tagTypes: ['Notes'],
  endpoints: () => ({}),
});
