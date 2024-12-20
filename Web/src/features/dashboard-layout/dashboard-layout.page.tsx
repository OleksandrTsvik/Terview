import { Layout } from 'antd';
import { useState } from 'react';
import { Outlet, ScrollRestoration } from 'react-router';

import { classnames } from '@/common/class-names.utils';
import { stringToBoolean } from '@/common/type-converters.utils';

import DashboardHeader from './dashboard.header';
import DashboardSider from './dashboard.sider';

import styles from './dashboard.module.scss';

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
    <>
      <ScrollRestoration />
      <Layout>
        <DashboardSider collapsed={collapsed} onCollapse={handleCollapse} />
        <Layout className={classnames({ [styles.layout]: true, [styles.layout_sider_active]: !collapsed })}>
          <DashboardHeader collapsed={collapsed} onCollapse={handleCollapse} />
          <Layout.Content className={styles.layout__main}>
            <div className={styles.main__content}>
              <Outlet />
            </div>
          </Layout.Content>
        </Layout>
      </Layout>
    </>
  );
}
