import { TextEditorOutput } from '@/components/text-editor';

import { NoteResponse } from './notes-edit.models';

interface Props {
  note: NoteResponse;
}

export default function NotesEditItemContent({ note }: Props) {
  return <TextEditorOutput text={note.content} />;
}
