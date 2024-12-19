import { Layout, Spin } from 'antd';
import { useLayoutEffect, useState } from 'react';

import { useAppDispatch } from '@/hooks/redux-hooks';

import { useRefreshTokenMutation } from './auth.api';
import { setCredentials } from './auth.slice';
import useAuth from './use-auth';

interface Props {
  children: React.ReactNode;
}

export default function AuthMiddleware({ children }: Props) {
  const appDispatch = useAppDispatch();

  const { isAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  const [refreshTokenMutation] = useRefreshTokenMutation();

  useLayoutEffect(() => {
    const refreshToken = localStorage.getItem('refresh-token');

    if (isAuth || !refreshToken) {
      setIsLoading(false);
      return;
    }

    refreshTokenMutation({ refreshToken })
      .unwrap()
      .then((response) => {
        localStorage.setItem('access-token', response.accessToken);
        localStorage.setItem('refresh-token', response.refreshToken);
        appDispatch(setCredentials({ email: response.email }));
      })
      .catch(() => {
        localStorage.removeItem('access-token');
        localStorage.removeItem('refresh-token');
      })
      .finally(() => setIsLoading(false));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Spin fullscreen tip="Завантаження ..." />
      </Layout>
    );
  }

  return children;
}
