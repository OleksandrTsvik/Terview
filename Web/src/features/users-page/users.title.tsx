import { Button, Flex, Typography } from 'antd';

import useModal from '@/hooks/use-modal';

import CreateUserModal from './create-user.modal';

import styles from './users.module.scss';

export default function UsersTitle() {
  const { isOpen, handleOpen, handleClose } = useModal();

  return (
    <>
      <Flex className={styles.title} justify="space-between" align="center" gap="middle" wrap="wrap">
        <Typography.Title>Користувачі</Typography.Title>
        <Button type="primary" onClick={handleOpen}>
          Зареєструвати користувача
        </Button>
      </Flex>
      <CreateUserModal open={isOpen} onClose={handleClose} />
    </>
  );
}
