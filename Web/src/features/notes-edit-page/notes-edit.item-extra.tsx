import { App, MenuProps } from 'antd';
import { MenuInfo } from 'rc-menu/es/interface';
import { useNavigate } from 'react-router';

import { PermissionType } from '@/auth/permission-type.enum';
import useAuth from '@/auth/use-auth';
import ActionsDropdown from '@/components/actions-dropdown';
import { DeleteIcon, EditIcon, RestoreIcon } from '@/components/icons';

import { useDeleteNoteMutation, useRestoreNoteMutation } from './notes-edit.api';
import { NoteResponse } from './notes-edit.models';

interface Props {
  note: NoteResponse;
}

export default function NotesEditItemExtra({ note }: Props) {
  const navigate = useNavigate();
  const { modal, notification } = App.useApp();

  const { filterAuthItems } = useAuth();

  const [restoreNote] = useRestoreNoteMutation();
  const [deleteNote] = useDeleteNoteMutation();

  const handleRestoreClick = (info: MenuInfo) => {
    info.domEvent.stopPropagation();

    modal.confirm({
      content: `Ви дійсно бажаєте відновити '${note.title}'?`,
      onOk: () =>
        restoreNote({ id: note.id })
          .unwrap()
          .catch(() => notification.error({ message: 'Виникла помилка' })),
    });
  };

  const handleEditClick = (info: MenuInfo) => {
    info.domEvent.stopPropagation();
    navigate(`/dashboard/notes/edit/${note.id}`);
  };

  const handleDeleteClick = (info: MenuInfo) => {
    info.domEvent.stopPropagation();

    modal.confirm({
      content: `Ви дійсно бажаєте видалити '${note.title}'?`,
      okButtonProps: { danger: true },
      onOk: () =>
        deleteNote({ id: note.id })
          .unwrap()
          .catch(() => notification.error({ message: 'Виникла помилка' })),
    });
  };

  const items: MenuProps['items'] = filterAuthItems([
    {
      show: note.isDeleted,
      permissions: [PermissionType.RestoreNote, PermissionType.RestoreOwnNote],
      value: {
        key: 'restore',
        icon: <RestoreIcon />,
        label: 'Відновити',
        onClick: handleRestoreClick,
      },
    },
    {
      show: !note.isDeleted,
      permissions: [PermissionType.UpdateNote, PermissionType.UpdateOwnNote],
      value: {
        key: 'edit',
        icon: <EditIcon />,
        label: 'Редагувати',
        onClick: handleEditClick,
      },
    },
    {
      show: !note.isDeleted,
      permissions: [PermissionType.DeleteNote, PermissionType.DeleteOwnNote],
      value: {
        key: 'delete',
        icon: <DeleteIcon />,
        label: 'Видалити',
        onClick: handleDeleteClick,
      },
    },
  ]);

  const handleButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
  };

  return <ActionsDropdown items={items} onClick={handleButtonClick} />;
}
