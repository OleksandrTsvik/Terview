import { NoteResponse } from './notes-edit.models';

interface Props {
  note: NoteResponse;
}

export default function NotesEditItemContent({ note }: Props) {
  return <p style={{ margin: 0 }}>{note.content}</p>;
}
