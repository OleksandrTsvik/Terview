import { Flex, Tag } from 'antd';

import { NoteResponse } from './notes.models';

import styles from './notes.module.scss';

interface Props {
  note: NoteResponse;
  selectedTags: string[];
}

export default function NotesItemLabel({ note, selectedTags }: Props) {
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
