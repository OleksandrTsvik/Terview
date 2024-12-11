import { Input } from 'antd';

import NotesList from './notes.list';
import NotesTags from './notes.tags';

export default function NotesPage() {
  return (
    <>
      <Input.Search placeholder="Пошук за ключовими словами..." />
      <NotesTags />
      <NotesList />
    </>
  );
}
