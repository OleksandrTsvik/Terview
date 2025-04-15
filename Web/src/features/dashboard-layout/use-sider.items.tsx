import {
  BookOutlined,
  ContainerOutlined,
  DashboardOutlined,
  DropboxOutlined,
  HeartOutlined,
  HistoryOutlined,
  PictureOutlined,
  TagsOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { MenuProps } from 'antd';

import { PermissionType } from '@/auth/permission-type.enum';
import useAuth from '@/auth/use-auth';

export default function useSiderItems(): MenuProps['items'] {
  const { filterAuthItems } = useAuth();

  return filterAuthItems([
    {
      value: {
        key: '/dashboard',
        icon: <DashboardOutlined />,
        label: 'Dashboard',
      },
    },
    {
      permissions: [PermissionType.ReadNote, PermissionType.ReadOwnNote],
      value: {
        key: '/dashboard/notes',
        icon: <BookOutlined />,
        label: 'Нотатки',
      },
    },
    {
      permissions: [PermissionType.ReadNoteTag],
      value: {
        key: '/dashboard/notes/tags',
        icon: <TagsOutlined />,
        label: 'Теги',
      },
    },
    {
      permissions: [PermissionType.ReadNoteImage],
      value: {
        key: '/dashboard/images',
        icon: <PictureOutlined />,
        label: 'Зображення',
      },
    },
    {
      permissions: [PermissionType.ReadUser],
      value: {
        key: '/dashboard/users',
        icon: <UserOutlined />,
        label: 'Користувачі',
      },
    },
    {
      permissions: [PermissionType.ReadOutboxMessage],
      value: {
        key: '/dashboard/outbox',
        icon: <DropboxOutlined />,
        label: 'Outbox',
      },
    },
    {
      permissions: [PermissionType.ReadJob],
      value: {
        key: '/dashboard/scheduler',
        icon: <HistoryOutlined />,
        label: 'Scheduler',
      },
    },
    {
      permissions: [PermissionType.ReadLog],
      value: {
        key: '/dashboard/logs',
        icon: <ContainerOutlined />,
        label: 'Logs',
      },
    },
    {
      permissions: [PermissionType.HealthChecks],
      value: {
        key: '/dashboard/health',
        icon: <HeartOutlined />,
        label: 'Health',
      },
    },
  ]);
}
