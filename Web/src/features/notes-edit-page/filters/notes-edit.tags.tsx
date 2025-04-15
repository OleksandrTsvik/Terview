import { StopOutlined } from '@ant-design/icons';
import { Button, Tag } from 'antd';
import { useSearchParams } from 'react-router';

import { useGetNotesTagsQuery } from '../notes-edit.api';
import { DEFAULT_TAG_SEARCH_MODE, QUERY_PARAMS } from '../notes-edit.constants';

import styles from '../notes-edit.module.scss';

const tagSearchModeDisplay: { [mode: string]: string } = {
  all: 'all',
  any: 'any',
};

export default function NotesEditTags() {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedTags = searchParams.getAll(QUERY_PARAMS.TAGS);
  const selectedTagSearchMode = searchParams.get(QUERY_PARAMS.TAG_SEARCH_MODE) ?? DEFAULT_TAG_SEARCH_MODE;

  const { data } = useGetNotesTagsQuery({ tags: selectedTagSearchMode === 'all' ? selectedTags : null });

  const handleTagSearchModeClick = () => {
    const value = selectedTagSearchMode === 'all' ? 'any' : 'all';

    setSearchParams((prev) => {
      prev.delete(QUERY_PARAMS.PAGE_NUMBER);
      prev.set(QUERY_PARAMS.TAG_SEARCH_MODE, value);

      return prev;
    });
  };

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
      <Button
        className={styles.tags__search_mode}
        color="primary"
        variant="dashed"
        size="small"
        onClick={handleTagSearchModeClick}
      >
        {tagSearchModeDisplay[selectedTagSearchMode] ?? tagSearchModeDisplay[DEFAULT_TAG_SEARCH_MODE]}
      </Button>
      {data.map((tag) => (
        <Tag key={tag} color={selectedTags.includes(tag) ? 'green' : 'default'} onClick={() => handleTagClick(tag)}>
          {tag}
        </Tag>
      ))}
      {!!selectedTags.length && (
        <Tag
          className={styles.tags__reset}
          bordered={false}
          color="gold"
          icon={<StopOutlined />}
          onClick={handleResetClick}
        >
          Скинути
        </Tag>
      )}
    </div>
  );
}
