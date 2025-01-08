import { useSearchParams } from 'react-router';

import { PermissionType } from '@/auth/permission-type.enum';
import PermissionsGuard from '@/auth/permissions.guard';
import { stringToNumber } from '@/common/type-converters.utils';

import UpdatePermissionsModal from './update-permissions.modal';
import { useGetUsersQuery } from './users.api';
import { QUERY_PARAMS } from './users.constants';
import UsersList from './users.list';
import UsersTitle from './users.title';
import UsersTotal from './users.total';

export default function UsersPage() {
  const [searchParams] = useSearchParams();

  const email = searchParams.get(QUERY_PARAMS.EMAIL);
  const permissions = searchParams.getAll(QUERY_PARAMS.PERMISSIONS);
  const sort = searchParams.get(QUERY_PARAMS.SORT);
  const sortDirection = searchParams.get(QUERY_PARAMS.SORT_DIRECTION);
  const pageNumber = stringToNumber(searchParams.get(QUERY_PARAMS.PAGE_NUMBER), 1);
  const pageSize = stringToNumber(searchParams.get(QUERY_PARAMS.PAGE_SIZE), 20);

  const { data, isFetching, refetch } = useGetUsersQuery({
    email,
    permissions,
    sort,
    sortDirection,
    pageNumber,
    pageSize,
  });

  return (
    <>
      <UsersTitle />
      <UsersTotal total={data?.totalItems ?? 0} loading={isFetching} refetch={refetch} />
      <UsersList
        loading={isFetching}
        users={data?.items}
        filters={{ email, permissions, sort, sortDirection }}
        pagination={{ total: data?.totalItems ?? 0, pageNumber, pageSize }}
      />
      <PermissionsGuard permissions={[PermissionType.UpdateUserPermission]}>
        <UpdatePermissionsModal />
      </PermissionsGuard>
    </>
  );
}
