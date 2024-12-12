import { Input } from 'antd';

import NotesFetch from './notes.fetch';
import NotesTags from './notes.tags';

export default function NotesPage() {
  return (
    <>
      <Input.Search placeholder="Пошук за ключовими словами..." />
      <NotesTags />
      <NotesFetch />
    </>
  );
}
