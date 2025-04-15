export type HealthStatus = 'Healthy' | 'Unhealthy';

export type HealthReportEntry = {
  data?: unknown;
  description?: string;
  duration: string;
  exception?: string;
  status: HealthStatus;
  tags: string[];
};

export type HealthEntry = [string, HealthReportEntry];

export interface HealthResponse {
  status: HealthStatus;
  totalDuration: string;
  entries: { [name: string]: HealthReportEntry };
}

export interface HealthErrorResponse {
  status: number;
  data: HealthResponse;
}
