import { Input } from 'antd';
import { useSearchParams } from 'react-router';

import { QUERY_PARAMS } from './tags.constants';

import styles from './tags.module.scss';

interface Props {
  loading?: boolean;
}

export default function TagsSearch({ loading }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get(QUERY_PARAMS.QUERY) ?? '';

  const handleSearch = (value: string) => {
    setSearchParams((prev) => {
      prev.delete(QUERY_PARAMS.PAGE_NUMBER);

      if (value) {
        prev.set(QUERY_PARAMS.QUERY, value);
      } else {
        prev.delete(QUERY_PARAMS.QUERY);
      }

      return prev;
    });
  };

  return (
    <Input.Search
      className={styles.search}
      allowClear
      placeholder="Пошук"
      loading={loading}
      defaultValue={query}
      onSearch={handleSearch}
    />
  );
}
