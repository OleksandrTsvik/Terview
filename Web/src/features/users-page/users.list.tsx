import { green, red } from '@ant-design/colors';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Table, TableColumnsType, TableProps } from 'antd';
import dayjs from 'dayjs';
import { useSearchParams } from 'react-router';

import { classnames } from '@/common/class-names.utils';
import { isArrayOfStrings, isString } from '@/common/type-guards.utils';
import ActionsDropdown from '@/components/actions-dropdown';
import TableContainer from '@/components/table-container';
import useTableSearchProps from '@/hooks/use-table-search-props';

import usePagination from './use-pagination';
import useUserActions from './use-user-actions';
import { QUERY_PARAMS } from './users.constants';
import { UserResponse } from './users.models';
import { getColumnSortOrder } from './users.utils';

import styles from './users.module.scss';

interface Props {
  loading?: boolean;
  users?: UserResponse[];
  filters: { email?: string | null; sort?: string | null; sortDirection?: string | null };
  pagination: { total: number; pageNumber: number; pageSize: number };
}

export default function UsersList({
  loading,
  users,
  filters: { email, sort, sortDirection },
  pagination: { total, pageNumber, pageSize },
}: Props) {
  const [, setSearchParams] = useSearchParams();

  const pagination = usePagination(total, pageNumber, pageSize);
  const { getColumnSearchProps } = useTableSearchProps<UserResponse>({ email });

  const { getUserActions } = useUserActions();

  const columns: TableColumnsType<UserResponse> = [
    {
      key: 'index',
      title: '#',
      width: 1,
      render: (_, __, index) => pageSize * (pageNumber - 1) + index + 1,
    },
    {
      dataIndex: 'email-verified',
      width: 1,
      render: (_, { emailVerified }) =>
        emailVerified ? (
          <CheckOutlined style={{ color: green.primary }} />
        ) : (
          <CloseOutlined style={{ color: red.primary }} />
        ),
    },
    {
      key: 'email',
      dataIndex: 'email',
      title: 'Email',
      sorter: true,
      sortOrder: getColumnSortOrder('email', sort, sortDirection),
      ...getColumnSearchProps('email', 'Email'),
    },
    {
      key: 'date',
      title: 'Дата реєстрації',
      sorter: true,
      sortOrder: getColumnSortOrder('date', sort, sortDirection),
      render: (_, { createdOnUtc }) => dayjs(createdOnUtc).format('DD.MM.YYYY HH:mm:ss'),
    },
    {
      key: 'actions',
      width: 1,
      render: (_, user) => <ActionsDropdown items={getUserActions(user)} />,
    },
  ];

  const handleChangeTableFilters: TableProps<UserResponse>['onChange'] = (_, filters, sorter, { action }) => {
    if (action === 'paginate') {
      return;
    }

    setSearchParams((prev) => {
      prev.delete(QUERY_PARAMS.PAGE_NUMBER);

      if (isArrayOfStrings(filters['email']) && filters['email'].length) {
        prev.set(QUERY_PARAMS.EMAIL, filters['email'][0]);
      } else {
        prev.delete(QUERY_PARAMS.EMAIL);
      }

      if (!Array.isArray(sorter) && isString(sorter.columnKey) && isString(sorter.order)) {
        prev.set(QUERY_PARAMS.SORT, sorter.columnKey);
        prev.set(QUERY_PARAMS.SORT_DIRECTION, sorter.order);
      } else {
        prev.delete(QUERY_PARAMS.SORT);
        prev.delete(QUERY_PARAMS.SORT_DIRECTION);
      }

      return prev;
    });
  };

  return (
    <TableContainer>
      <Table
        rowClassName={({ deletedOnUtc }) => classnames({ [styles.user_deleted]: !!deletedOnUtc })}
        rowHoverable
        loading={loading}
        columns={columns}
        pagination={pagination}
        dataSource={users}
        rowKey={(user) => user.id}
        onChange={handleChangeTableFilters}
      />
    </TableContainer>
  );
}
