import { Tag } from 'antd';
import { useSearchParams } from 'react-router';

import { QUERY_PARAMS } from './notes.constants';

import styles from './notes.module.scss';

export default function NotesTags() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTags = searchParams.getAll(QUERY_PARAMS.TAGS);

  const tags = ['web', 'js', '.net', 'asp.net core'];

  const handleTagClick = (name: string) => {
    const tags = selectedTags.includes(name) ? selectedTags.filter((tag) => tag !== name) : [...selectedTags, name];

    setSearchParams((prev) => {
      prev.delete(QUERY_PARAMS.PAGE_NUMBER);
      prev.delete(QUERY_PARAMS.TAGS);

      tags.forEach((tag) => prev.append(QUERY_PARAMS.TAGS, tag));

      return prev;
    });
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
