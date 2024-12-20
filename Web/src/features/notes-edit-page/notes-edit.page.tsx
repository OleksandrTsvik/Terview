import NotesEditFetch from './notes-edit.fetch';
import NotesEditSearch from './notes-edit.search';
import NotesEditTags from './notes-edit.tags';
import NotesEditTitle from './notes-edit.title';

export default function NotesEditPage() {
  return (
    <>
      <NotesEditTitle />
      <NotesEditSearch />
      <NotesEditTags />
      <NotesEditFetch />
    </>
  );
}
