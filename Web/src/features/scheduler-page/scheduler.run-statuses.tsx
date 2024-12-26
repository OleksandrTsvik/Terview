import { Tag } from 'antd';
import { useSearchParams } from 'react-router';

import { QUERY_PARAMS } from './scheduler.constants';

import styles from './scheduler.module.scss';

interface Props {
  statuses: string[];
}

export default function SchedulerRunStatuses({ statuses }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedStatus = searchParams.get(QUERY_PARAMS.LAST_RUN_STATUS);

  const handleStatusClick = (status: string) => {
    setSearchParams((prev) => {
      prev.delete(QUERY_PARAMS.PAGE_NUMBER);
      const selectedStatus = prev.get(QUERY_PARAMS.LAST_RUN_STATUS);

      if (status == selectedStatus) {
        prev.delete(QUERY_PARAMS.LAST_RUN_STATUS);
      } else {
        prev.set(QUERY_PARAMS.LAST_RUN_STATUS, status);
      }

      return prev;
    });
  };

  if (statuses.length < 2) {
    return null;
  }

  return (
    <div className={styles.run_statuses}>
      {statuses.map((status) => (
        <Tag
          key={status}
          color={status === selectedStatus ? 'green' : 'default'}
          onClick={() => handleStatusClick(status)}
        >
          {status}
        </Tag>
      ))}
    </div>
  );
}
