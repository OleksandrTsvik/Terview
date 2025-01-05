import { useSearchParams } from 'react-router';

import { stringToNumber } from '@/common/type-converters.utils';

import { useGetUsersQuery } from './users.api';
import { QUERY_PARAMS } from './users.constants';
import UsersList from './users.list';
import UsersTitle from './users.title';
import UsersTotal from './users.total';

export default function UsersPage() {
  const [searchParams] = useSearchParams();

  const email = searchParams.get(QUERY_PARAMS.EMAIL);
  const sort = searchParams.get(QUERY_PARAMS.SORT);
  const sortDirection = searchParams.get(QUERY_PARAMS.SORT_DIRECTION);
  const pageNumber = stringToNumber(searchParams.get(QUERY_PARAMS.PAGE_NUMBER), 1);
  const pageSize = stringToNumber(searchParams.get(QUERY_PARAMS.PAGE_SIZE), 20);

  const { data, isFetching, refetch } = useGetUsersQuery({ email, sort, sortDirection, pageNumber, pageSize });

  return (
    <>
      <UsersTitle />
      <UsersTotal total={data?.totalItems ?? 0} loading={isFetching} refetch={refetch} />
      <UsersList
        loading={isFetching}
        users={data?.items}
        filters={{ email, sort, sortDirection }}
        pagination={{ total: data?.totalItems ?? 0, pageNumber, pageSize }}
      />
    </>
  );
}
