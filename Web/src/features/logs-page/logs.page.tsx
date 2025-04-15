import { Empty, Skeleton, Spin } from 'antd';
import { useState } from 'react';
import { useSearchParams } from 'react-router';

import { stringToBoolean, stringToNumber } from '@/common/type-converters.utils';

import { useGetLogsQuery } from './logs.api';
import { QUERY_PARAMS } from './logs.constants';
import LogsLevels from './logs.levels';
import LogsList from './logs.list';
import LogsPagination from './logs.pagination';
import LogsRefetch from './logs.refetch';

function initStateAutoRefetch() {
  return stringToBoolean(localStorage.getItem('logs-auto-refetch'));
}

export default function LogsPage() {
  const [searchParams] = useSearchParams();

  const levels = searchParams.getAll(QUERY_PARAMS.LEVELS);
  const pageNumber = stringToNumber(searchParams.get(QUERY_PARAMS.PAGE_NUMBER), 1);
  const pageSize = stringToNumber(searchParams.get(QUERY_PARAMS.PAGE_SIZE), 20);

  const [autoRefetch, setAutoRefetch] = useState(initStateAutoRefetch);

  const { data, isLoading, isFetching, refetch } = useGetLogsQuery(
    { levels, pageNumber, pageSize },
    autoRefetch
      ? {
          pollingInterval: 15000,
          refetchOnMountOrArgChange: true,
        }
      : {},
  );

  const handleAutoRefetchChange = (checked: boolean) => {
    localStorage.setItem('logs-auto-refetch', checked.toString());
    setAutoRefetch(checked);
  };

  if (isLoading) {
    return <Skeleton active />;
  }

  if (!data || !data.items.length) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Логи відсутні" />;
  }

  return (
    <>
      <LogsRefetch
        isFetching={isFetching}
        autoRefetch={autoRefetch}
        totalItems={data.totalItems}
        refetch={refetch}
        onAutoRefetchChange={handleAutoRefetchChange}
      />
      <Spin spinning={isFetching}>
        <LogsLevels levels={data.logLevels} />
        <LogsList logs={data.items} />
        <LogsPagination current={data.currentPage} total={data.totalItems} pageSize={data.pageSize} />
      </Spin>
    </>
  );
}
