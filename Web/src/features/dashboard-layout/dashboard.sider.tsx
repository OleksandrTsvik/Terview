import { Avatar, Drawer, Layout } from 'antd';
import { Link } from 'react-router';

import useBreakpointValue from '@/hooks/use-breakpoint-value';

import DashboardSiderMenu from './dashboard.sider-menu';

import styles from './dashboard.module.scss';

import logo from '@/assets/logo.svg';

interface Props {
  collapsed: boolean;
  onCollapse: () => void;
}

export default function DashboardSider({ collapsed, onCollapse }: Props) {
  return useBreakpointValue({
    sm: (
      <Layout.Sider className={styles.sider} collapsible collapsed={collapsed} trigger={null}>
        <Link to="/" className={styles.logo}>
          <Avatar src={logo} size={40} />
        </Link>
        <DashboardSiderMenu />
      </Layout.Sider>
    ),
    xs: (
      <Drawer
        width="100%"
        placement="left"
        open={!collapsed}
        extra={
          <Link to="/">
            <Avatar src={logo} />
          </Link>
        }
        styles={{ body: { padding: 0 } }}
        onClose={onCollapse}
      >
        <DashboardSiderMenu theme="light" onSelect={onCollapse} />
      </Drawer>
    ),
  });
}
