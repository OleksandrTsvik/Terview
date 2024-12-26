import { App } from 'antd';

import { useAppDispatch } from '@/hooks/redux-hooks';

import { useLoginMutation } from './auth.api';
import { LoginRequest } from './auth.models';
import { setCredentials } from './auth.slice';
import { TokenProvider } from './token.provider';

export default function useLogin() {
  const appDispatch = useAppDispatch();
  const { notification } = App.useApp();

  const [loginMutation, { isLoading, isError, error }] = useLoginMutation();

  const login = async (data: LoginRequest) => {
    try {
      const response = await loginMutation(data).unwrap();

      TokenProvider.setAccessToken(response.accessToken);
      TokenProvider.setRefreshToken(response.refreshToken);
      appDispatch(setCredentials({ email: response.email }));
    } catch {
      notification.error({ message: 'Неправильна адреса електронної пошти або пароль' });

      TokenProvider.deleteAccessToken();
      TokenProvider.deleteRefreshToken();
    }
  };

  return { login, isLoading, isError, error };
}
