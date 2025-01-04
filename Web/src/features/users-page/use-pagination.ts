import { TablePaginationConfig } from 'antd';
import { useSearchParams } from 'react-router';

import { QUERY_PARAMS } from './users.constants';

export default function usePagination(total: number, pageNumber: number, pageSize: number): TablePaginationConfig {
  const [, setSearchParams] = useSearchParams();

  const handleChange = (page: number, pageSize: number) => {
    setSearchParams((prev) => {
      prev.set(QUERY_PARAMS.PAGE_NUMBER, page.toString());
      prev.set(QUERY_PARAMS.PAGE_SIZE, pageSize.toString());

      return prev;
    });
  };

  return {
    responsive: true,
    showSizeChanger: true,
    pageSizeOptions: [15, 20, 50, 100],
    total,
    current: pageNumber,
    pageSize,
    onChange: handleChange,
  };
}
