import { Flex, Tag } from 'antd';
import { Link } from 'react-router';

import { NoteResponse } from './notes.models';

import styles from './notes.module.scss';

interface Props {
  note: NoteResponse;
  selectedTags: string[];
}

export default function NotesItemLabel({ note, selectedTags }: Props) {
  return (
    <>
      <Link to={`/notes/${note.slug}`} className={styles.item__title}>
        {note.title}
      </Link>
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
