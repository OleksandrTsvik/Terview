import { Pagination } from 'antd';
import { useSearchParams } from 'react-router';

import { QUERY_PARAMS } from './outbox.constants';

import styles from './outbox.module.scss';

interface Props {
  current: number;
  total: number;
  pageSize: number;
}

export default function OutboxPagination({ current, total, pageSize }: Props) {
  const [, setSearchParams] = useSearchParams();

  const handlePaginationChange = (page: number, pageSize: number) => {
    setSearchParams((prev) => {
      prev.set(QUERY_PARAMS.PAGE_NUMBER, page.toString());
      prev.set(QUERY_PARAMS.PAGE_SIZE, pageSize.toString());

      return prev;
    });
  };

  return (
    <Pagination
      className={styles.outbox__pagination}
      showSizeChanger
      responsive
      current={current}
      total={total}
      pageSize={pageSize}
      pageSizeOptions={[15, 20, 30]}
      onChange={handlePaginationChange}
    />
  );
}
