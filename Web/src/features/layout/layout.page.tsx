import { Layout } from 'antd';
import { Outlet, ScrollRestoration } from 'react-router';

import Footer from './footer';

import styles from './layout.module.scss';

export default function LayoutPage() {
  return (
    <>
      <ScrollRestoration />
      <Layout className={styles.wrapper}>
        <div className={styles.content}>
          <Outlet />
        </div>
        <Footer />
      </Layout>
    </>
  );
}
