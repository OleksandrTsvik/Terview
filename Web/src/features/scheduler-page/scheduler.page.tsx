import { Empty, Skeleton, Spin, Typography } from 'antd';
import cronstrue from 'cronstrue';
import 'cronstrue/locales/uk';
import { useSearchParams } from 'react-router';

import { stringToNumber } from '@/common/type-converters.utils';
import RefetchButton from '@/components/refetch-button';

import { useGetJobsQuery } from './scheduler.api';
import { QUERY_PARAMS } from './scheduler.constants';
import SchedulerList from './scheduler.list';
import SchedulerPagination from './scheduler.pagination';
import SchedulerRunStatuses from './scheduler.run-statuses';
import UpdatePeriodModal from './update-period.modal';

import styles from './scheduler.module.scss';

cronstrue.defaultLocale = 'uk';

export default function SchedulerPage() {
  const [searchParams] = useSearchParams();

  const lastRunStatus = searchParams.get(QUERY_PARAMS.LAST_RUN_STATUS);
  const pageNumber = stringToNumber(searchParams.get(QUERY_PARAMS.PAGE_NUMBER), 1);
  const pageSize = stringToNumber(searchParams.get(QUERY_PARAMS.PAGE_SIZE), 20);

  const { data, isLoading, isFetching, refetch } = useGetJobsQuery(
    { lastRunStatus, pageNumber, pageSize },
    { refetchOnMountOrArgChange: true },
  );

  if (isLoading) {
    return <Skeleton active />;
  }

  if (!data) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Джоби відсутні" />;
  }

  return (
    <>
      <Typography.Paragraph className={styles.total} type="secondary">
        <span>Усього джоб: {data.totalItems}</span>
        <RefetchButton loading={isFetching} onClick={refetch} />
      </Typography.Paragraph>
      <Spin spinning={isFetching}>
        <SchedulerRunStatuses statuses={data.jobRunStatuses} />
        <SchedulerList jobs={data.items} />
        <SchedulerPagination current={data.currentPage} total={data.totalItems} pageSize={data.pageSize} />
      </Spin>
      <UpdatePeriodModal />
    </>
  );
}
