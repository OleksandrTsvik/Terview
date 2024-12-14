import { Input } from 'antd';
import { useSearchParams } from 'react-router';

import { QUERY_PARAMS } from './notes.constants';

export default function NotesSearch() {
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
    <Input.Search allowClear placeholder="Пошук за ключовими словами..." defaultValue={query} onSearch={handleSearch} />
  );
}
