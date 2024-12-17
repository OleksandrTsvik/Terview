import { BookOutlined, DashboardOutlined, PictureOutlined, TagsOutlined } from '@ant-design/icons';
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
    key: '/dashboard/tags',
    icon: <TagsOutlined />,
    label: 'Теги',
  },
  {
    key: '/dashboard/gallery',
    icon: <PictureOutlined />,
    label: 'Галерея',
  },
];
