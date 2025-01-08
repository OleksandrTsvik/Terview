import { useAppSelector } from '@/hooks/redux-hooks';

import { AuthItem } from './auth.models';
import { selectCurrentUser } from './auth.slice';
import { PermissionType } from './permission-type.enum';

export default function useAuth() {
  const user = useAppSelector(selectCurrentUser);

  const hasPermission = (permissions: PermissionType[]) => {
    if (!permissions.length) {
      return true;
    }

    if (!user?.permissions.length) {
      return false;
    }

    return (
      user.permissions.includes(PermissionType.FullAccess) ||
      permissions.some((permission) => user.permissions.includes(permission))
    );
  };

  const filterAuthItems = <TValue>(items: AuthItem<TValue>[]): TValue[] => {
    return items
      .filter(
        (item) =>
          (item.show === undefined && item.permissions === undefined) ||
          (item.show && item.permissions === undefined) ||
          (item.show === undefined && hasPermission(item.permissions ?? [])) ||
          (item.show && hasPermission(item.permissions ?? [])),
      )
      .map((item) => item.value);
  };

  return {
    isAuth: !!user,
    user,
    hasPermission,
    filterAuthItems,
  };
}
