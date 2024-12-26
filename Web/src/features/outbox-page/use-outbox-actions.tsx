import { green } from '@ant-design/colors';
import { CaretRightOutlined } from '@ant-design/icons';
import { App, MenuProps } from 'antd';

import { useRunEventMutation } from './outbox.api';
import { OutboxResponse } from './outbox.models';

export default function useOutboxActions() {
  const { notification } = App.useApp();

  const [runEvent] = useRunEventMutation();

  const handleRunClick = (outboxMessageId: string) => {
    runEvent({ id: outboxMessageId })
      .unwrap()
      .catch(() => notification.error({ message: 'Виникла помилка' }));
  };

  const getOutboxActions = (outboxMessage: OutboxResponse): MenuProps['items'] => [
    {
      key: 'run',
      icon: <CaretRightOutlined style={{ color: green.primary }} />,
      label: 'Запустити',
      onClick: () => handleRunClick(outboxMessage.id),
    },
  ];

  return { getOutboxActions };
}
