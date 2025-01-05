import { classnames } from '@/common/class-names.utils';

import styles from './outbox.module.scss';

interface Props {
  processedOnUtc?: string;
  error?: string;
}

export default function OutboxStatus({ processedOnUtc, error }: Props) {
  if (!processedOnUtc) {
    return <span className={classnames([styles.outbox__status, styles.outbox__status_new])}>New</span>;
  }

  if (error) {
    return <span className={classnames([styles.outbox__status, styles.outbox__status_failed])}>Failed</span>;
  }

  return <span className={classnames([styles.outbox__status, styles.outbox__status_success])}>Success</span>;
}
