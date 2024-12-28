import { App, Flex, MenuProps } from 'antd';

import ActionsDropdown from '@/components/actions-dropdown';
import { DeleteIcon, EditIcon } from '@/components/icons';
import { useAppDispatch } from '@/hooks/redux-hooks';

import { useDeleteNotesTagMutation } from './tags.api';
import { selectUpdateTag } from './tags.slice';

import styles from './tags.module.scss';

interface Props {
  tags: string[];
}

export default function TagsList({ tags }: Props) {
  const { modal, notification } = App.useApp();
  const appDispatch = useAppDispatch();

  const [deleteTag] = useDeleteNotesTagMutation();

  const handleEditClick = (tag: string) => {
    appDispatch(selectUpdateTag(tag));
  };

  const handleDeleteClick = (tag: string) => {
    modal.confirm({
      content: `Ви дійсно бажаєте видалити тег '${tag}'?`,
      okButtonProps: { danger: true },
      onOk: () =>
        deleteTag({ tag })
          .unwrap()
          .catch(() => notification.error({ message: 'Виникла помилка' })),
    });
  };

  const getTagActions = (tag: string): MenuProps['items'] => [
    {
      key: 'edit',
      icon: <EditIcon />,
      label: 'Редагувати',
      onClick: () => handleEditClick(tag),
    },
    {
      key: 'delete',
      icon: <DeleteIcon />,
      label: 'Видалити',
      onClick: () => handleDeleteClick(tag),
    },
  ];

  return (
    <Flex gap="large" wrap="wrap">
      {tags.map((tag) => (
        <div key={tag} className={styles.tag}>
          {tag} <ActionsDropdown items={getTagActions(tag)} />
        </div>
      ))}
    </Flex>
  );
}
