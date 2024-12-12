import NotesFetch from './notes.fetch';
import NotesSearch from './notes.search';
import NotesTags from './notes.tags';

export default function NotesPage() {
  return (
    <>
      <NotesSearch />
      <NotesTags />
      <NotesFetch />
    </>
  );
}
