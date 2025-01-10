import { SwapOutlined } from '@ant-design/icons';
import { Flex, Select, SelectProps } from 'antd';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';

import { PermissionType } from '@/auth/permission-type.enum';
import PermissionsGuard from '@/auth/permissions.guard';
import DebounceSelect from '@/components/debounce-select';

import { useLazyGetUsersQuery } from './notes-edit.api';
import { DEFAULT_SORT, QUERY_PARAMS } from './notes-edit.constants';

const options: SelectProps['options'] = [
  { value: 'alphabet', label: 'За алфавітом' },
  { value: 'date', label: 'За датою' },
];

interface UserValue {
  label: string;
  value: string;
}

export default function NotesEditFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [createdByValue, setCreatedByValue] = useState<UserValue | null>();
  const createdById = searchParams.get(QUERY_PARAMS.CREATED_BY);

  const sort = searchParams.get(QUERY_PARAMS.SORT)?.toLowerCase();
  const defaultSortValue = options?.some(({ value }) => value == sort) ? sort : DEFAULT_SORT;

  const [getUsers] = useLazyGetUsersQuery();

  useEffect(() => {
    if (!createdById) {
      return;
    }

    getUsers({ userIds: [createdById] })
      .unwrap()
      .then((response) => {
        setCreatedByValue(
          response?.items.length ? { label: response.items[0].email, value: response.items[0].id } : null,
        );
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUserList = async (email: string): Promise<UserValue[]> => {
    const response = await getUsers({ email }).unwrap();

    return response.items.map((user) => ({ label: user.email, value: user.id }));
  };

  const handleUserChange = (value?: UserValue) => {
    if (!value) {
      setCreatedByValue(null);
      setSearchParams((prev) => {
        prev.delete(QUERY_PARAMS.CREATED_BY);
        return prev;
      });

      return;
    }

    setCreatedByValue(value);
    setSearchParams((prev) => {
      prev.delete(QUERY_PARAMS.PAGE_NUMBER);
      prev.set(QUERY_PARAMS.CREATED_BY, value.value);

      return prev;
    });
  };

  const handleSortChange = (value: string) => {
    setSearchParams((prev) => {
      prev.delete(QUERY_PARAMS.PAGE_NUMBER);
      prev.set(QUERY_PARAMS.SORT, value);

      return prev;
    });
  };

  return (
    <Flex align="center" justify="space-between" gap="middle" wrap>
      <PermissionsGuard permissions={[PermissionType.ReadNote]}>
        <DebounceSelect
          allowClear
          placeholder="Введіть email користувача"
          value={createdByValue}
          style={{ width: 230 }}
          fetchOptions={fetchUserList}
          onChange={(value) => handleUserChange(value as UserValue)}
        />
      </PermissionsGuard>
      <Select
        defaultValue={defaultSortValue}
        options={options}
        suffixIcon={<SwapOutlined rotate={90} />}
        style={{ width: 130 }}
        onChange={handleSortChange}
      />
    </Flex>
  );
}
