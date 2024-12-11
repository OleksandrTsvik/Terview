import { Tag } from 'antd';
import { useState } from 'react';

import { NoteTag } from './notes.model';

import styles from './notes.module.scss';

export default function NotesTags() {
  const [tags, setTags] = useState<NoteTag[]>([
    { name: 'web', checked: false },
    { name: 'js', checked: true },
    { name: '.net', checked: false },
    { name: 'asp.net core', checked: false },
  ]);

  const handleTagClick = (name: string) => {
    setTags((prevState) => prevState.map((tag) => (tag.name === name ? { ...tag, checked: !tag.checked } : tag)));
  };

  return (
    <div className={styles.tags}>
      {tags.map((tag) => (
        <Tag key={tag.name} color={tag.checked ? 'green' : 'default'} onClick={() => handleTagClick(tag.name)}>
          {tag.name}
        </Tag>
      ))}
    </div>
  );
}
