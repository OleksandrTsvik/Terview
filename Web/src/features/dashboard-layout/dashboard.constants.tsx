import {
  BookOutlined,
  ContainerOutlined,
  DashboardOutlined,
  DropboxOutlined,
  HistoryOutlined,
  PictureOutlined,
  TagsOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { MenuProps } from 'antd';

export const SIDER_ITEMS: MenuProps['items'] = [
  {
    key: '/dashboard',
    icon: <DashboardOutlined />,
    label: 'Dashboard',
  },
  {
    key: '/dashboard/notes',
    icon: <BookOutlined />,
    label: 'Нотатки',
  },
  {
    key: '/dashboard/notes/tags',
    icon: <TagsOutlined />,
    label: 'Теги',
  },
  {
    key: '/dashboard/images',
    icon: <PictureOutlined />,
    label: 'Зображення',
  },
  {
    key: '/dashboard/users',
    icon: <UserOutlined />,
    label: 'Користувачі',
  },
  {
    key: '/dashboard/outbox',
    icon: <DropboxOutlined />,
    label: 'Outbox',
  },
  {
    key: '/dashboard/scheduler',
    icon: <HistoryOutlined />,
    label: 'Scheduler',
  },
  {
    key: '/dashboard/logs',
    icon: <ContainerOutlined />,
    label: 'Logs',
  },
];
