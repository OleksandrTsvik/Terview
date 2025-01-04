import { MenuProps } from 'antd';

import { DeleteIcon } from '@/components/icons';

import { UserResponse } from './users.models';

export default function useUserActions() {
  const handleDeleteClick = (user: UserResponse) => {
    console.log('delete', user.email);
  };

  const getUserActions = (user: UserResponse): MenuProps['items'] => [
    {
      key: 'delete',
      icon: <DeleteIcon />,
      label: 'Видалити',
      onClick: () => handleDeleteClick(user),
    },
  ];

  return { getUserActions };
}
