import { StopOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import { useSearchParams } from 'react-router';

import { useGetNotesTagsQuery } from './notes.api';
import { QUERY_PARAMS } from './notes.constants';

import styles from './notes.module.scss';

export default function NotesTags() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTags = searchParams.getAll(QUERY_PARAMS.TAGS);

  const { data } = useGetNotesTagsQuery();

  const handleTagClick = (name: string) => {
    const tags = selectedTags.includes(name) ? selectedTags.filter((tag) => tag !== name) : [...selectedTags, name];

    setSearchParams((prev) => {
      prev.delete(QUERY_PARAMS.PAGE_NUMBER);
      prev.delete(QUERY_PARAMS.TAGS);

      tags.forEach((tag) => prev.append(QUERY_PARAMS.TAGS, tag));

      return prev;
    });
  };

  const handleResetClick = () => {
    setSearchParams((prev) => {
      prev.delete(QUERY_PARAMS.PAGE_NUMBER);
      prev.delete(QUERY_PARAMS.TAGS);

      return prev;
    });
  };

  if (!data || !data.length) {
    return null;
  }

  return (
    <div className={styles.tags}>
      {data.map((tag) => (
        <Tag key={tag} color={selectedTags.includes(tag) ? 'green' : 'default'} onClick={() => handleTagClick(tag)}>
          {tag}
        </Tag>
      ))}
      {!!selectedTags.length && (
        <Tag className={styles.tags__reset} bordered={false} color="gold" icon={<StopOutlined />} onClick={handleResetClick}>
          Скинути
        </Tag>
      )}
    </div>
  );
}
