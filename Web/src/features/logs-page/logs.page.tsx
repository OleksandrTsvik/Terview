import { Empty, Skeleton, Spin, Typography } from 'antd';
import { useSearchParams } from 'react-router';

import { stringToNumber } from '@/common/type-converters.utils';

import { useGetLogsQuery } from './logs.api';
import { QUERY_PARAMS } from './logs.constants';
import LogsLevels from './logs.levels';
import LogsList from './logs.list';
import LogsPagination from './logs.pagination';

import styles from './logs.module.scss';

export default function LogsPage() {
  const [searchParams] = useSearchParams();

  const levels = searchParams.getAll(QUERY_PARAMS.LEVELS);
  const pageNumber = stringToNumber(searchParams.get(QUERY_PARAMS.PAGE_NUMBER), 1);
  const pageSize = stringToNumber(searchParams.get(QUERY_PARAMS.PAGE_SIZE), 20);

  const { data, isLoading, isFetching } = useGetLogsQuery({ levels, pageNumber, pageSize });

  if (isLoading) {
    return <Skeleton active />;
  }

  if (!data) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Логи відсутні" />;
  }

  return (
    <Spin spinning={isFetching}>
      <Typography.Paragraph className={styles.total} type="secondary">
        Усього логів: {data.totalItems}
      </Typography.Paragraph>
      <LogsLevels levels={data.logLevels} />
      <LogsList logs={data.items} />
      <LogsPagination current={data.currentPage} total={data.totalItems} pageSize={data.pageSize} />
    </Spin>
  );
}
