import { Drawer, Layout } from 'antd';
import { Link } from 'react-router';

import Logo from '@/components/logo';
import useBreakpointValue from '@/hooks/use-breakpoint-value';

import DashboardSiderMenu from './dashboard.sider-menu';

import styles from './dashboard.module.scss';

interface Props {
  collapsed: boolean;
  onCollapse: () => void;
}

export default function DashboardSider({ collapsed, onCollapse }: Props) {
  return useBreakpointValue({
    sm: (
      <Layout.Sider className={styles.sider} collapsible collapsed={collapsed} trigger={null}>
        <Link to="/" className={styles.logo}>
          <Logo size={40} />
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
            <Logo />
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
