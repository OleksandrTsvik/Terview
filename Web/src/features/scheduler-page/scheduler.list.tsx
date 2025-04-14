import { Table, TableColumnsType } from 'antd';
import dayjs from 'dayjs';

import { classnames } from '@/common/class-names.utils';
import ActionsDropdown from '@/components/actions-dropdown';
import TableContainer from '@/components/table-container';

import { JobResponse } from './scheduler.models';
import { getCronDescription } from './scheduler.utils';
import useJobActions from './use-job-actions';

import styles from './scheduler.module.scss';

interface Props {
  jobs: JobResponse[];
}

export default function SchedulerList({ jobs }: Props) {
  const { getJobActions } = useJobActions();

  const columns: TableColumnsType<JobResponse> = [
    { dataIndex: 'name', title: 'Назва' },
    {
      key: 'period',
      title: 'Період (UTC)',
      render: (_, job) => getCronDescription(job.cronExpression) || job.cronExpression,
    },
    {
      key: 'last-run-status',
      title: 'Статус останнього запуску',
      render: (_, job) => (
        <span
          className={classnames({
            [styles.job__run_status]: true,
            [styles[`job__run_status_${job.lastRunStatus.trim().toLowerCase()}`]]: true,
          })}
        >
          {job.lastRunStatus}
        </span>
      ),
    },
    {
      key: 'last-run-time',
      title: 'Час останнього запуску',
      render: (_, job) =>
        job.lastRunTimeInUtc ? dayjs(job.lastRunTimeInUtc).format('DD.MM.YYYY HH:mm:ss') : 'Відсутній',
    },
    {
      key: 'next-run-time',
      title: 'Час наступного запуску',
      render: (_, job) => dayjs(job.nextRunTimeInUtc).format('DD.MM.YYYY HH:mm:ss'),
    },
    {
      key: 'actions',
      width: 1,
      render: (_, job) => <ActionsDropdown items={getJobActions(job)} />,
    },
  ];

  return (
    <TableContainer>
      <Table
        rowHoverable
        pagination={false}
        columns={columns}
        dataSource={jobs}
        rowKey={(job) => job.id}
        expandable={{
          expandedRowRender: (job) => <p className={styles.job__error}>{job.error}</p>,
          rowExpandable: (job) => !!job.error,
        }}
      />
    </TableContainer>
  );
}
