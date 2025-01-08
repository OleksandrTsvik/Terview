import { green } from '@ant-design/colors';
import { CaretRightOutlined } from '@ant-design/icons';
import { App, MenuProps } from 'antd';

import { PermissionType } from '@/auth/permission-type.enum';
import useAuth from '@/auth/use-auth';
import { DeleteIcon } from '@/components/icons';

import { useDeleteOutboxMessageMutation, useRunEventMutation } from './outbox.api';
import { OutboxResponse } from './outbox.models';

export default function useOutboxActions() {
  const { modal, notification } = App.useApp();

  const { filterAuthItems } = useAuth();

  const [runEvent] = useRunEventMutation();
  const [deleteOutboxMessage] = useDeleteOutboxMessageMutation();

  const handleRunClick = (outboxMessageId: string) => {
    runEvent({ id: outboxMessageId })
      .unwrap()
      .catch(() => notification.error({ message: 'Виникла помилка' }));
  };

  const handleDeleteClick = (outboxMessageId: string) => {
    modal.confirm({
      content: 'Підтвердіть видалення',
      okButtonProps: { danger: true },
      onOk: () =>
        deleteOutboxMessage({ id: outboxMessageId })
          .unwrap()
          .catch(() => notification.error({ message: 'Виникла помилка' })),
    });
  };

  const getOutboxActions = (outboxMessage: OutboxResponse): MenuProps['items'] =>
    filterAuthItems([
      {
        permissions: [PermissionType.RunOutboxMessage],
        value: {
          key: 'run',
          icon: <CaretRightOutlined style={{ color: green.primary }} />,
          label: 'Запустити',
          onClick: () => handleRunClick(outboxMessage.id),
        },
      },
      {
        permissions: [PermissionType.DeleteOutboxMessage],
        value: {
          key: 'delete',
          icon: <DeleteIcon />,
          label: 'Видалити',
          onClick: () => handleDeleteClick(outboxMessage.id),
        },
      },
    ]);

  return { getOutboxActions };
}
