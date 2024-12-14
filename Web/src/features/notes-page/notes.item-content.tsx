import { NoteResponse } from './notes.models';

interface Props {
  note: NoteResponse;
}

export default function NotesItemContent({ note }: Props) {
  return <p style={{ margin: 0 }}>{note.content}</p>;
}
