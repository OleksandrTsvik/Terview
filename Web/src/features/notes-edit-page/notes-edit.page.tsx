import NotesEditSearch from './filters/notes-edit.search';
import NotesEditTags from './filters/notes-edit.tags';
import NotesEditFetch from './notes-edit.fetch';
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
