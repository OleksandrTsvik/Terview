import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons/lib/icons';
import { Button, Layout } from 'antd';

import styles from './dashboard.module.scss';

interface Props {
  collapsed: boolean;
  onCollapse: () => void;
}

export default function DashboardHeader({ collapsed, onCollapse }: Props) {
  return (
    <Layout.Header className={styles.layout__header}>
      <Button
        className={styles.header__collapsed_button}
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={onCollapse}
      />
    </Layout.Header>
  );
}
