import { Typography } from 'antd';

import RefetchButton from '@/components/refetch-button';

import styles from './users.module.scss';

interface Props {
  total: number;
  loading?: boolean;
  refetch: () => void;
}

export default function UsersTotal({ total, loading, refetch }: Props) {
  return (
    <Typography.Paragraph className={styles.total} type="secondary">
      <span>Усього користувачів: {total}</span>
      <RefetchButton loading={loading} onClick={refetch} />
    </Typography.Paragraph>
  );
}
