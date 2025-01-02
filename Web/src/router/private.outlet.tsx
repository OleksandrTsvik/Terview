import { Navigate, Outlet, useLocation } from 'react-router';

import useAuth from '@/auth/use-auth';

interface Props {
  redirectTo?: string;
}

export default function PrivateOutlet({ redirectTo = '/login' }: Props) {
  const location = useLocation();
  const { isAuth } = useAuth();

  if (!isAuth) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  return <Outlet />;
}
