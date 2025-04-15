import { Table, TableColumnsType, Typography } from 'antd';

import TableContainer from '@/components/table-container';

import { HealthEntry } from './health.models';

import styles from './health.module.scss';

interface Props {
  healthEntries: HealthEntry[];
}

export default function HealthList({ healthEntries }: Props) {
  const columns: TableColumnsType<HealthEntry> = [
    {
      key: 'name',
      title: 'Name',
      render: (_, [name]) => name,
    },
    {
      key: 'status',
      title: 'Status',
      render: (_, [, entry]) => (
        <Typography.Text type={entry.status === 'Healthy' ? 'success' : 'danger'}>{entry.status}</Typography.Text>
      ),
    },
    {
      key: 'duration',
      title: 'Duration',
      render: (_, [, entry]) => entry.duration,
    },
  ];

  return (
    <TableContainer>
      <Table
        rowHoverable
        pagination={false}
        columns={columns}
        dataSource={healthEntries}
        rowKey={([name]) => name}
        expandable={{
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          expandedRowRender: ([, { status, duration, ...entry }]) => (
            <pre className={styles.health__metadata}>{JSON.stringify(entry, null, 2)}</pre>
          ),
        }}
      />
    </TableContainer>
  );
}
