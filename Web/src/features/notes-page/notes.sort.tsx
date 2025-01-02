import { SwapOutlined } from '@ant-design/icons';
import { Select, SelectProps } from 'antd';
import { useSearchParams } from 'react-router';

import { DEFAULT_SORT, QUERY_PARAMS } from './notes.constants';

const options: SelectProps['options'] = [
  { value: 'alphabet', label: 'За алфавітом' },
  { value: 'date', label: 'За датою' },
];

export default function NotesSort() {
  const [searchParams, setSearchParams] = useSearchParams();

  const sort = searchParams.get(QUERY_PARAMS.SORT)?.toLowerCase();
  const defaultValue = options?.some(({ value }) => value == sort) ? sort : DEFAULT_SORT;

  const handleChange = (value: string) => {
    setSearchParams((prev) => {
      prev.delete(QUERY_PARAMS.PAGE_NUMBER);
      prev.set(QUERY_PARAMS.SORT, value);

      return prev;
    });
  };

  return (
    <Select
      variant="filled"
      defaultValue={defaultValue}
      options={options}
      suffixIcon={<SwapOutlined rotate={90} />}
      style={{ width: 130 }}
      onChange={handleChange}
    />
  );
}
