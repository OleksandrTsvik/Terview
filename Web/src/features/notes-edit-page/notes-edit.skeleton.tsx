import { Flex, Skeleton } from 'antd';

import styles from './notes-edit.module.scss';

export default function NotesEditSkeleton() {
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
