import { Flex, Switch, Typography } from 'antd';

import RefetchButton from '@/components/refetch-button';

import styles from './logs.module.scss';

interface Props {
  isFetching: boolean;
  autoRefetch: boolean;
  totalItems: number;
  refetch: () => void;
  onAutoRefetchChange: (checked: boolean) => void;
}

export default function LogsRefetch({ isFetching, autoRefetch, totalItems, refetch, onAutoRefetchChange }: Props) {
  return (
    <Flex className={styles.refetch} align="center" justify="space-between" gap="middle" wrap>
      <Switch
        checkedChildren="Автооновл. увімк."
        unCheckedChildren="Автооновл. вимк."
        value={autoRefetch}
        onChange={onAutoRefetchChange}
      />
      <Typography.Text className={styles.total} type="secondary">
        <span>Усього логів: {totalItems}</span>
        <RefetchButton loading={isFetching} onClick={refetch} />
      </Typography.Text>
    </Flex>
  );
}
