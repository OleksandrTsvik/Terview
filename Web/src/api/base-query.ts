import { BaseQueryFn, FetchArgs, FetchBaseQueryError, fetchBaseQuery } from '@reduxjs/toolkit/query';
import { Mutex } from 'async-mutex';
import queryString from 'query-string';

import { resetAuthState } from '@/auth/auth.slice';
import { API_URL } from '@/common/node-env.constants';

export const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers) => {
    const accessToken = localStorage.getItem('access-token');

    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }

    return headers;
  },
  paramsSerializer: queryString.stringify,
});

// Preventing multiple unauthorized errors
// https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#preventing-multiple-unauthorized-errors

type RefreshResponse = { accessToken: string; refreshToken: string };

// create a new mutex
const mutex = new Mutex();

export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  // wait until the mutex is available without locking it
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // checking whether the mutex is locked
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      try {
        const refreshResult = await baseQuery('/users/refresh-token', api, extraOptions);

        if (refreshResult.data) {
          const { accessToken, refreshToken } = refreshResult.data as RefreshResponse;
          localStorage.setItem('access-token', accessToken);
          localStorage.setItem('refresh-token', refreshToken);

          // retry the initial query
          result = await baseQuery(args, api, extraOptions);
        } else {
          localStorage.removeItem('access-token');
          localStorage.removeItem('refresh-token');
          api.dispatch(resetAuthState());
        }
      } finally {
        // release must be called once the mutex should be released again.
        release();
      }
    } else {
      // wait until the mutex is available without locking it
      await mutex.waitForUnlock();

      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};
