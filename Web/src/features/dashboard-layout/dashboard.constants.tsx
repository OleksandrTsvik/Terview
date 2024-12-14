import { BookOutlined, HomeOutlined } from '@ant-design/icons';
import { MenuProps } from 'antd';

export const SIDER_ITEMS: MenuProps['items'] = [
  {
    key: '/dashboard',
    icon: <HomeOutlined />,
    label: 'Dashboard',
  },
  {
    key: '/dashboard/notes',
    icon: <BookOutlined />,
    label: 'Нотатки',
  },
];
