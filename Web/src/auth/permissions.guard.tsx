import { PermissionType } from './permission-type.enum';
import useAuth from './use-auth';

interface Props {
  permissions: PermissionType[];
  children: React.ReactNode;
}

export default function PermissionsGuard({ permissions, children }: Props) {
  const { hasPermission } = useAuth();

  if (!hasPermission(permissions)) {
    return null;
  }

  return children;
}
