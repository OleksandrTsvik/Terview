import { Empty, Flex, Skeleton, Spin, Typography } from 'antd';

import RefetchButton from '@/components/refetch-button';

import { useHealthCheckQuery } from './health.api';
import HealthList from './health.list';
import { HealthErrorResponse, HealthResponse } from './health.models';
import { isHealthErrorResponse } from './health.utils';

export default function HealthPage() {
  const { data, error, isLoading, isFetching, isError, refetch } = useHealthCheckQuery();

  const errorResponse: HealthErrorResponse | null = isHealthErrorResponse(error) ? error : null;
  const response: HealthResponse | undefined = errorResponse ? errorResponse.data : data;

  if (isLoading) {
    return <Skeleton active />;
  }

  return (
    <>
      <Flex align="center" justify="space-between" wrap>
        <Typography.Title>Health Check</Typography.Title>
        <RefetchButton loading={isFetching} onClick={refetch} />
      </Flex>
      {!response || (isError && !errorResponse) ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Дані відсутні" />
      ) : (
        <Spin spinning={isFetching}>
          <Typography.Title level={3} type={response.status === 'Healthy' ? 'success' : 'danger'}>
            Status: {response.status}
          </Typography.Title>
          <Typography.Paragraph>TotalDuration: {response.totalDuration}</Typography.Paragraph>
          <HealthList healthEntries={Object.entries(response.entries)} />
        </Spin>
      )}
    </>
  );
}
