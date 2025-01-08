import { geekblue, volcano } from '@ant-design/colors';
import { MailOutlined, SafetyOutlined } from '@ant-design/icons';
import { App, MenuProps } from 'antd';

import { PermissionType } from '@/auth/permission-type.enum';
import useAuth from '@/auth/use-auth';
import { DeleteIcon, RestoreIcon } from '@/components/icons';
import { useAppDispatch } from '@/hooks/redux-hooks';

import { useDeleteUserMutation, useResendVerificationEmailMutation, useRestoreUserMutation } from './users.api';
import { UserResponse } from './users.models';
import { selectUpdateUserPermissions } from './users.slice';

export default function useUserActions() {
  const appDispatch = useAppDispatch();
  const { modal, notification } = App.useApp();

  const { filterAuthItems } = useAuth();

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

  const handleUpdatePermissionsClick = (user: UserResponse) => {
    appDispatch(selectUpdateUserPermissions(user));
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

  const getUserActions = (user: UserResponse): MenuProps['items'] =>
    filterAuthItems([
      {
        show: !!user.deletedOnUtc,
        permissions: [PermissionType.RestoreUser],
        value: {
          key: 'restore',
          icon: <RestoreIcon />,
          label: 'Відновити',
          onClick: () => handleRestoreClick(user),
        },
      },
      {
        show: !user.deletedOnUtc && !user.emailVerified,
        permissions: [PermissionType.ResendVerificationEmail],
        value: {
          key: 'resend-verification-email',
          icon: <MailOutlined style={{ color: geekblue.primary }} />,
          label: 'Надіслати підтвердження пошти',
          onClick: () => handleResendVerificationEmailClick(user),
        },
      },
      {
        show: !user.deletedOnUtc,
        permissions: [PermissionType.UpdateUserPermission],
        value: {
          key: 'update-permissions',
          icon: <SafetyOutlined style={{ color: volcano.primary }} />,
          label: 'Змінити дозволи',
          onClick: () => handleUpdatePermissionsClick(user),
        },
      },
      {
        show: !user.deletedOnUtc,
        permissions: [PermissionType.DeleteUser],
        value: {
          key: 'delete',
          icon: <DeleteIcon />,
          label: 'Видалити',
          onClick: () => handleDeleteClick(user),
        },
      },
    ]);

  return { getUserActions };
}
