import { Navigate, Outlet, useLocation } from 'react-router';

import useAuth from '@/auth/use-auth';

interface Props {
  redirectTo?: string;
}

export default function AnonymousOutlet({ redirectTo = '/' }: Props) {
  const location = useLocation();
  const { isAuth } = useAuth();

  if (isAuth) {
    return <Navigate to={location.state?.from ?? redirectTo} replace />;
  }

  return <Outlet />;
}
