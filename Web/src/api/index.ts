import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import queryString from 'query-string';

import { API_URL } from '../common/node-env.constants';

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    credentials: 'include',
    paramsSerializer: queryString.stringify,
  }),
  tagTypes: ['Notes'],
  endpoints: () => ({}),
});
