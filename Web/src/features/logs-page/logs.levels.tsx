import { StopOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import { useSearchParams } from 'react-router';

import { QUERY_PARAMS } from './logs.constants';

import styles from './logs.module.scss';

interface Props {
  levels: string[];
}

export default function LogsLevels({ levels }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedLevels = searchParams.getAll(QUERY_PARAMS.LEVELS);

  const handleLevelClick = (name: string) => {
    const levels = selectedLevels.includes(name)
      ? selectedLevels.filter((level) => level !== name)
      : [...selectedLevels, name];

    setSearchParams((prev) => {
      prev.delete(QUERY_PARAMS.PAGE_NUMBER);
      prev.delete(QUERY_PARAMS.LEVELS);

      levels.forEach((tag) => prev.append(QUERY_PARAMS.LEVELS, tag));

      return prev;
    });
  };

  const handleResetClick = () => {
    setSearchParams((prev) => {
      prev.delete(QUERY_PARAMS.PAGE_NUMBER);
      prev.delete(QUERY_PARAMS.LEVELS);

      return prev;
    });
  };

  if (levels.length < 2) {
    return null;
  }

  return (
    <div className={styles.levels}>
      {levels.map((level) => (
        <Tag
          key={level}
          color={selectedLevels.includes(level) ? 'green' : 'default'}
          onClick={() => handleLevelClick(level)}
        >
          {level}
        </Tag>
      ))}
      {!!selectedLevels.length && (
        <Tag
          className={styles.levels__reset}
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
