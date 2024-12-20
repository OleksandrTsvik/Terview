import { LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons/lib/icons';
import { Button, Flex, Layout } from 'antd';

import useLogout from '@/auth/use-logout';

import styles from './dashboard.module.scss';

interface Props {
  collapsed: boolean;
  onCollapse: () => void;
}

export default function DashboardHeader({ collapsed, onCollapse }: Props) {
  const { logout, isLoading } = useLogout();

  return (
    <Layout.Header className={styles.layout__header}>
      <Button
        className={styles.header__collapsed_button}
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={onCollapse}
      />
      <Flex component="nav" gap="small">
        <Button type="text" icon={<LogoutOutlined />} loading={isLoading} onClick={logout} />
      </Flex>
    </Layout.Header>
  );
}
