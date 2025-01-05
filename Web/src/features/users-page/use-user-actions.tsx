import { geekblue } from '@ant-design/colors';
import { MailOutlined } from '@ant-design/icons';
import { App, MenuProps } from 'antd';

import { DeleteIcon, RestoreIcon } from '@/components/icons';

import { useDeleteUserMutation, useResendVerificationEmailMutation, useRestoreUserMutation } from './users.api';
import { UserResponse } from './users.models';

export default function useUserActions() {
  const { modal, notification } = App.useApp();

  const [restoreUser] = useRestoreUserMutation();
  const [resendVerificationEmail] = useResendVerificationEmailMutation();
  const [deleteUser] = useDeleteUserMutation();

  const handleRestoreClick = (user: UserResponse) => {
    modal.confirm({
      content: `Ви дійсно бажаєте відновити користувача з email ${user.email}?`,
      onOk: () =>
        restoreUser({ id: user.id })
          .unwrap()
          .catch(() => notification.error({ message: 'Виникла помилка' })),
    });
  };

  const handleResendVerificationEmailClick = (user: UserResponse) => {
    modal.confirm({
      content: `Повторно надіслати підтвердження пошти для ${user.email}?`,
      onOk: () =>
        resendVerificationEmail({ id: user.id })
          .unwrap()
          .catch(() => notification.error({ message: 'Виникла помилка' })),
    });
  };

  const handleDeleteClick = (user: UserResponse) => {
    modal.confirm({
      content: `Ви дійсно бажаєте видалити користувача з email ${user.email}?`,
      okButtonProps: { danger: true },
      onOk: () =>
        deleteUser({ id: user.id })
          .unwrap()
          .catch(() => notification.error({ message: 'Виникла помилка' })),
    });
  };

  const getUserActions = (user: UserResponse): MenuProps['items'] => [
    ...(user.deletedOnUtc
      ? [
          {
            key: 'restore',
            icon: <RestoreIcon />,
            label: 'Відновити',
            onClick: () => handleRestoreClick(user),
          },
        ]
      : [
          ...(!user.emailVerified
            ? [
                {
                  key: 'resend-verification-email',
                  icon: <MailOutlined style={{ color: geekblue.primary }} />,
                  label: 'Надіслати підтвердження пошти',
                  onClick: () => handleResendVerificationEmailClick(user),
                },
              ]
            : []),
          {
            key: 'delete',
            icon: <DeleteIcon />,
            label: 'Видалити',
            onClick: () => handleDeleteClick(user),
          },
        ]),
  ];

  return { getUserActions };
}
