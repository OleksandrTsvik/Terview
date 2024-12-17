import { MoreOutlined } from '@ant-design/icons';
import { Button, Dropdown, MenuProps } from 'antd';
import { useNavigate } from 'react-router';

import { DeleteIcon, EditIcon } from '@/components/icons';

import { NoteResponse } from './notes-edit.models';

interface Props {
  note: NoteResponse;
}

export default function NotesEditItemExtra({ note }: Props) {
  const navigate = useNavigate();

  const items: MenuProps['items'] = [
    {
      key: '1',
      icon: <EditIcon />,
      label: 'Редагувати',
      onClick: () => navigate(`/dashboard/notes/edit/${note.id}`),
    },
    {
      key: '2',
      icon: <DeleteIcon />,
      label: 'Видалити',
    },
  ];

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
  };

  return (
    <Dropdown menu={{ items }}>
      <Button type="text" icon={<MoreOutlined />} onClick={handleClick} />
    </Dropdown>
  );
}
