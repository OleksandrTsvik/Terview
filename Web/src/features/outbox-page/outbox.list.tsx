import { Table, TableColumnsType } from 'antd';
import dayjs from 'dayjs';

import ActionsDropdown from '@/components/actions-dropdown';
import TableContainer from '@/components/table-container';

import { OutboxResponse } from './outbox.models';
import OutboxStatus from './outbox.status';
import useOutboxActions from './use-outbox-actions';

import styles from './outbox.module.scss';

interface Props {
  outboxMessages: OutboxResponse[];
}

export default function OutboxList({ outboxMessages }: Props) {
  const { getOutboxActions } = useOutboxActions();

  const columns: TableColumnsType<OutboxResponse> = [
    { dataIndex: 'type', title: 'Тип' },
    {
      key: 'status',
      title: 'Статус',
      render: (_, { processedOnUtc, error }) => <OutboxStatus processedOnUtc={processedOnUtc} error={error} />,
    },
    {
      key: 'occurred',
      title: 'Створено',
      render: (_, { occurredOnUtc }) => dayjs(occurredOnUtc).format('DD.MM.YYYY HH:mm:ss'),
    },
    {
      key: 'actions',
      width: 1,
      render: (_, outboxMessage) => <ActionsDropdown items={getOutboxActions(outboxMessage)} />,
    },
  ];

  return (
    <TableContainer>
      <Table
        rowHoverable
        pagination={false}
        columns={columns}
        dataSource={outboxMessages}
        rowKey={(outboxMessage) => outboxMessage.id}
        expandable={{
          expandedRowRender: ({ content, processedOnUtc, error }) => (
            <pre className={styles.outbox__metadata}>
              {JSON.stringify(
                {
                  content: JSON.parse(content),
                  processedDate: processedOnUtc ? dayjs(processedOnUtc).format('DD.MM.YYYY HH:mm:ss') : null,
                  error,
                },
                null,
                2,
              )}
            </pre>
          ),
        }}
      />
    </TableContainer>
  );
}
