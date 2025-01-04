import { Pagination, Typography } from 'antd';
import { useSearchParams } from 'react-router';

import { QUERY_PARAMS } from './notes.constants';

import styles from './notes.module.scss';

interface Props {
  current: number;
  total: number;
  pageSize: number;
}

export default function NotesPagination({ current, total, pageSize }: Props) {
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
      className={styles.notes__pagination}
      showSizeChanger
      responsive
      current={current}
      total={total}
      pageSize={pageSize}
      pageSizeOptions={[5, 10, 15, 20, 30]}
      showTotal={(total) => <Typography.Text type="secondary">Усього записів: {total}</Typography.Text>}
      onChange={handlePaginationChange}
    />
  );
}
