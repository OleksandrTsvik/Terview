import { Pagination } from 'antd';
import { useSearchParams } from 'react-router';

import { QUERY_PARAMS } from './tags.constants';

import styles from './tags.module.scss';

interface Props {
  current: number;
  total: number;
  pageSize: number;
}

export default function TagsPagination({ current, total, pageSize }: Props) {
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
      className={styles.pagination}
      showSizeChanger
      responsive
      current={current}
      total={total}
      pageSize={pageSize}
      pageSizeOptions={[20, 30, 40, 50, 60, 70]}
      onChange={handlePaginationChange}
    />
  );
}
