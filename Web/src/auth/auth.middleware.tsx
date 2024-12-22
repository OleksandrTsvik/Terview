import { Layout, Spin } from 'antd';
import { useLayoutEffect, useState } from 'react';

import { useAppDispatch } from '@/hooks/redux-hooks';

import { useRefreshTokenMutation } from './auth.api';
import { setCredentials } from './auth.slice';
import { TokenProvider } from './token.provider';
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
    const refreshToken = TokenProvider.getRefreshToken();

    if (isAuth || !refreshToken) {
      setIsLoading(false);
      return;
    }

    refreshTokenMutation({ refreshToken })
      .unwrap()
      .then((response) => {
        TokenProvider.setAccessToken(response.accessToken);
        TokenProvider.setRefreshToken(response.refreshToken);
        appDispatch(setCredentials({ email: response.email }));
      })
      .catch(() => {
        TokenProvider.deleteAccessToken();
        TokenProvider.deleteRefreshToken();
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
