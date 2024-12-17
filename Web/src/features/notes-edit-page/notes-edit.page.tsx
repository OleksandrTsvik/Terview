import NotesEditFetch from './notes-edit.fetch';
import NotesEditSearch from './notes-edit.search';
import NotesEditTags from './notes-edit.tags';

export default function NotesEditPage() {
  return (
    <>
      <NotesEditSearch />
      <NotesEditTags />
      <NotesEditFetch />
    </>
  );
}
