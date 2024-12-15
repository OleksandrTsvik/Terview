import { Avatar, Layout } from 'antd';
import { useState } from 'react';
import { Link, Outlet } from 'react-router';

import { classnames } from '@/common/class-names.utils';
import { stringToBoolean } from '@/common/type-converters.utils';

import DashboardHeader from './dashboard.header';
import DashboardSiderMenu from './dashboard.sider-menu';

import styles from './dashboard.module.scss';

import logo from '@/assets/logo.svg';

function initStateCollapsed() {
  return stringToBoolean(localStorage.getItem('sider-collapsed'));
}

export default function DashboardLayoutPage() {
  const [collapsed, setCollapsed] = useState(initStateCollapsed);

  const handleCollapse = () => {
    localStorage.setItem('sider-collapsed', (!collapsed).toString());
    setCollapsed(!collapsed);
  };

  return (
    <Layout>
      <Layout.Sider className={styles.sider} collapsible collapsed={collapsed} trigger={null}>
        <Link className={styles.logo} to="/">
          <Avatar src={logo} size={40} />
        </Link>
        <DashboardSiderMenu />
      </Layout.Sider>
      <Layout className={classnames({ [styles.layout]: true, [styles.layout_sider_active]: !collapsed })}>
        <DashboardHeader collapsed={collapsed} onCollapse={handleCollapse} />
        <Layout.Content className={styles.layout__main}>
          <Outlet />
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
