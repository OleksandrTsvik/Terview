import { Collapse } from 'antd';
import dayjs from 'dayjs';

import { classnames } from '@/common/class-names.utils';

import { LogResponse } from './logs.models';

import styles from './logs.module.scss';

interface Props {
  logs: LogResponse[];
}

export default function LogsList({ logs }: Props) {
  return (
    <Collapse
      items={logs.map((log) => ({
        key: log.id,
        className: styles.log__label,
        label: (
          <>
            {`[${dayjs(log.createdOnUtc).format('DD.MM.YYYY HH:mm:ss')}]`}&nbsp;-&nbsp;
            <span className={classnames([styles.log__level, styles[`log__level_${log.level.trim().toLowerCase()}`]])}>
              {log.level}
            </span>
            &nbsp;-&nbsp;
            {log.message}
          </>
        ),
        children: log.metadata ? (
          <pre className={styles.log__metadata}>{JSON.stringify(JSON.parse(log.metadata), null, 2)}</pre>
        ) : (
          'Метадані відсутні.'
        ),
      }))}
    />
  );
}
