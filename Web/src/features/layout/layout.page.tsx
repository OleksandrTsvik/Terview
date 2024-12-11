import { Layout } from 'antd';
import { Outlet } from 'react-router';

import Footer from './footer';

import styles from './layout.module.scss';

export default function LayoutPage() {
  return (
    <Layout className={styles.wrapper}>
      <div className={styles.content}>
        <Outlet />
      </div>
      <Footer />
    </Layout>
  );
}
