import { Navigate, Outlet } from 'react-router';

import useAuth from '@/auth/use-auth';

interface Props {
  redirectTo?: string;
}

export default function PrivateOutlet({ redirectTo = '/login' }: Props) {
  const { isAuth } = useAuth();

  if (!isAuth) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}
