import { api } from '@/api';

import { GetJobsRequest, GetJobsResponse, UpdateJobPeriodRequest } from './scheduler.models';

export const schedulerApi = api.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    getJobs: builder.query<GetJobsResponse, GetJobsRequest>({
      query: ({ lastRunStatus, pageNumber, pageSize }) => ({
        url: '/scheduler',
        params: {
          s: lastRunStatus,
          p: pageNumber,
          ps: pageSize,
        },
      }),
      providesTags: ['UserSession', 'SchedulerJobs'],
    }),
    runJob: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/scheduler/${id}`,
        method: 'POST',
      }),
      invalidatesTags: (_, error) => (error ? [] : ['SchedulerJobs']),
    }),
    updateJobPeriod: builder.mutation<void, UpdateJobPeriodRequest>({
      query: ({ id, ...data }) => ({
        url: `/scheduler/period/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_, error) => (error ? [] : ['SchedulerJobs']),
    }),
  }),
});

export const { useGetJobsQuery, useRunJobMutation, useUpdateJobPeriodMutation } = schedulerApi;
