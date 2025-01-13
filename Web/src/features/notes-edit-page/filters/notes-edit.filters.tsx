import { Flex } from 'antd';

import NotesEditSort from './notes-edit.sort';
import NotesEditUser from './notes-edit.user';

export default function NotesEditFilters() {
  return (
    <Flex align="center" justify="space-between" gap="middle" wrap>
      <NotesEditUser />
      <NotesEditSort />
    </Flex>
  );
}
