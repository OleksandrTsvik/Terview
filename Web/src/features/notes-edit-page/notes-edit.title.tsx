import { Button, Flex, Typography } from 'antd';
import { Link } from 'react-router';

import { PermissionType } from '@/auth/permission-type.enum';
import PermissionsGuard from '@/auth/permissions.guard';

import styles from './notes-edit.module.scss';

export default function NotesEditTitle() {
  return (
    <Flex className={styles.title} justify="space-between" align="center" gap="middle" wrap="wrap">
      <Typography.Title>Нотатки</Typography.Title>
      <PermissionsGuard permissions={[PermissionType.CreateNote]}>
        <Link to="/dashboard/notes/add">
          <Button type="primary">Додати нотатку</Button>
        </Link>
      </PermissionsGuard>
    </Flex>
  );
}
