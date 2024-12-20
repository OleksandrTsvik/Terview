import { TextEditorOutput } from '@/components/text-editor';

import { NoteResponse } from './notes.models';

interface Props {
  note: NoteResponse;
}

export default function NotesItemContent({ note }: Props) {
  return <TextEditorOutput text={note.content} />;
}
