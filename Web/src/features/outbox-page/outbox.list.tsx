import { Table, TableColumnsType } from 'antd';
import dayjs from 'dayjs';

import { classnames } from '@/common/class-names.utils';
import ActionsDropdown from '@/components/actions-dropdown';
import TableContainer from '@/components/table-container';

import { OutboxResponse } from './outbox.models';
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
      render: (_, { processedOnUtc, error }) => (
        <span
          className={classnames({
            [styles.outbox__status]: true,
            [styles.outbox__status_new]: !processedOnUtc,
            [styles.outbox__status_failed]: !!error,
            [styles.outbox__status_success]: !!processedOnUtc && !error,
          })}
        >
          {!processedOnUtc && 'new'}
          {!!error && 'failed'}
          {!!processedOnUtc && !error && 'success'}
        </span>
      ),
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
