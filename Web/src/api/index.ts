import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithReauth } from './base-query';

export const api = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ['UserSession', 'Notes', 'OutboxMessages', 'SchedulerJobs'],
  endpoints: () => ({}),
});
