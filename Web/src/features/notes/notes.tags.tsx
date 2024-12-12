import { Tag } from 'antd';
import { useSearchParams } from 'react-router';

import styles from './notes.module.scss';

export default function NotesTags() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTags = searchParams.getAll('tags');

  const tags = ['web', 'js', '.net', 'asp.net core'];

  const handleTagClick = (name: string) => {
    const tags = selectedTags.includes(name) ? selectedTags.filter((tag) => tag !== name) : [...selectedTags, name];
    setSearchParams({ tags });
  };

  return (
    <div className={styles.tags}>
      {tags.map((tag) => (
        <Tag key={tag} color={selectedTags.includes(tag) ? 'green' : 'default'} onClick={() => handleTagClick(tag)}>
          {tag}
        </Tag>
      ))}
    </div>
  );
}
