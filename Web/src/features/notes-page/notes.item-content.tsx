import { Typography } from 'antd';
import dayjs from 'dayjs';

import { TextEditorOutput } from '@/components/text-editor';

import { NoteResponse } from './notes.models';

import styles from './notes.module.scss';

interface Props {
  note: NoteResponse;
}

export default function NotesItemContent({ note }: Props) {
  return (
    <>
      <TextEditorOutput text={note.content} />
      <Typography.Paragraph className={styles.item__date} type="secondary">
        {note.updatedOnUtc
          ? dayjs(note.updatedOnUtc).format('DD.MM.YYYY')
          : dayjs(note.createdOnUtc).format('DD.MM.YYYY')}
      </Typography.Paragraph>
    </>
  );
}
