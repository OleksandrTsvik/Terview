import { App, ConfigProvider, theme } from 'antd';
import ukUA from 'antd/locale/uk_UA';
import dayjs from 'dayjs';
import 'dayjs/locale/uk';

import styles from './antd.module.scss';

dayjs.locale('uk');

interface Props {
  children: React.ReactNode;
}

export default function AntdProvider({ children }: Props) {
  return (
    <ConfigProvider
      locale={ukUA}
      theme={{
        algorithm: theme.darkAlgorithm,
        cssVar: true,
      }}
    >
      <App className={styles.app} notification={{ placement: 'bottomRight' }}>
        {children}
      </App>
    </ConfigProvider>
  );
}
