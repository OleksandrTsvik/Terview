import { Flex, Tag } from 'antd';

import { NoteResponse } from './notes-edit.models';

import styles from './notes-edit.module.scss';

interface Props {
  note: NoteResponse;
  selectedTags: string[];
}

export default function NotesEditItemLabel({ note, selectedTags }: Props) {
  return (
    <>
      <div className={styles.item__title}>{note.title}</div>
      {!!note.tags.length && (
        <Flex wrap>
          {note.tags.map((tag) => (
            <Tag key={tag} color={selectedTags.includes(tag) ? 'lime' : 'default'}>
              {tag}
            </Tag>
          ))}
        </Flex>
      )}
    </>
  );
}
