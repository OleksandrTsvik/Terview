import { SearchOutlined } from '@ant-design/icons';
import { Button, Flex, Input, InputRef } from 'antd';
import { ColumnType } from 'antd/es/table';
import { FilterConfirmProps } from 'antd/es/table/interface';
import React, { useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';

export type GetColumnSearchProps<T> = (dataIndex: keyof T, placeholder?: string) => ColumnType<T>;

type SearchFilters<DataType> = { [key in keyof DataType]?: string | null };

type DataIndex<DataType> = keyof DataType;

export default function useTableSearchProps<DataType>(initFilters: SearchFilters<DataType> = {}) {
  const [searchFilters, setSearchFilters] = useState(initFilters);
  const searchInput = useRef<InputRef>(null);

  const updateSearchFilter = (key: DataIndex<DataType>, value?: string) => {
    setSearchFilters((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const onFilter = (
    selectedKeys: React.Key[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex<DataType>,
    closeDropdown: boolean = true,
  ) => {
    confirm({ closeDropdown });
    updateSearchFilter(dataIndex, selectedKeys[0] as string);
  };

  const resetFilter = (
    dataIndex: DataIndex<DataType>,
    confirm: (param?: FilterConfirmProps) => void,
    clearFilters: () => void,
    closeDropdown: boolean = true,
  ) => {
    clearFilters();
    confirm({ closeDropdown });
    updateSearchFilter(dataIndex);
  };

  const getColumnSearchProps: GetColumnSearchProps<DataType> = (dataIndex, placeholder) => ({
    filteredValue: searchFilters[dataIndex] ? [searchFilters[dataIndex]] : null,
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }} onKeyDown={(event) => event.stopPropagation()}>
        <Input
          ref={searchInput}
          value={selectedKeys[0]}
          placeholder={placeholder}
          style={{ marginBottom: 8, display: 'block' }}
          onChange={(event) => setSelectedKeys(event.target.value ? [event.target.value] : [])}
          onPressEnter={() => onFilter(selectedKeys, confirm, dataIndex)}
        />
        <Flex justify="flex-end" gap="small">
          <Button
            type="primary"
            size="small"
            icon={<SearchOutlined />}
            onClick={() => onFilter(selectedKeys, confirm, dataIndex)}
          >
            Пошук
          </Button>
          <Button size="small" onClick={() => clearFilters && resetFilter(dataIndex, confirm, clearFilters)}>
            Скинути
          </Button>
        </Flex>
      </div>
    ),
    filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
    render: (text?: string) => {
      const searchWord = searchFilters[dataIndex];

      if (!searchWord) {
        return text;
      }

      return (
        <Highlighter
          autoEscape
          searchWords={[searchWord]}
          textToHighlight={text?.toString() ?? ''}
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        />
      );
    },
  });

  return {
    searchFilters,
    getColumnSearchProps,
  };
}
