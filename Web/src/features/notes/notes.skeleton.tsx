import { Flex, Skeleton } from 'antd';

import styles from './notes.module.scss';

export default function NotesSkeleton() {
  return (
    <Flex className={styles.notes} vertical gap={20}>
      {Array(5)
        .fill(null)
        .map((_, index) => (
          <Skeleton.Input key={index} active block style={{ height: 46 }} />
        ))}
    </Flex>
  );
}
