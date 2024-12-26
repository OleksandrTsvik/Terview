import { PagedList, PagingParams } from '@/common/pagination.models';

export interface SchedulerState {
  selectedUpdateJobPeriod?: JobResponse;
}

export interface GetJobsResponse extends PagedList<JobResponse> {
  jobRunStatuses: string[];
}

export interface JobResponse {
  id: string;
  name: string;
  periodInSeconds: number;
  lastRunStatus: string;
  lastRunTimeInUtc?: string;
  nextRunTimeInUtc: string;
  error?: string;
}

export interface GetJobsRequest extends PagingParams {
  lastRunStatus?: string | null;
}

export interface UpdateJobPeriodRequest {
  id: string;
  periodInSeconds: number;
}
