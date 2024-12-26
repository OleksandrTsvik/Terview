import { Empty, Skeleton, Spin, Typography } from 'antd';
import { useSearchParams } from 'react-router';

import { stringToNumber } from '@/common/type-converters.utils';
import RefetchButton from '@/components/refetch-button';

import { useGetOutboxMessagesQuery } from './outbox.api';
import { QUERY_PARAMS } from './outbox.constants';
import OutboxList from './outbox.list';
import OutboxPagination from './outbox.pagination';

import styles from './outbox.module.scss';

export default function OutboxPage() {
  const [searchParams] = useSearchParams();

  const pageNumber = stringToNumber(searchParams.get(QUERY_PARAMS.PAGE_NUMBER), 1);
  const pageSize = stringToNumber(searchParams.get(QUERY_PARAMS.PAGE_SIZE), 20);

  const { data, isLoading, isFetching, refetch } = useGetOutboxMessagesQuery(
    { pageNumber, pageSize },
    {
      pollingInterval: 15000,
      refetchOnMountOrArgChange: true,
    },
  );

  if (isLoading) {
    return <Skeleton active />;
  }

  if (!data) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Події відсутні" />;
  }

  return (
    <>
      <Typography.Paragraph className={styles.total} type="secondary">
        <span>Усього подій: {data.totalItems}</span>
        <RefetchButton loading={isFetching} onClick={refetch} />
      </Typography.Paragraph>
      <Spin spinning={isFetching}>
        <OutboxList outboxMessages={data.items} />
        <OutboxPagination current={data.currentPage} total={data.totalItems} pageSize={data.pageSize} />
      </Spin>
    </>
  );
}
