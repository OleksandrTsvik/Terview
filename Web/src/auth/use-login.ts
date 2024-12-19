import { App } from 'antd';

import { useAppDispatch } from '@/hooks/redux-hooks';

import { useLoginMutation } from './auth.api';
import { LoginRequest } from './auth.models';
import { setCredentials } from './auth.slice';

export default function useLogin() {
  const appDispatch = useAppDispatch();
  const { notification } = App.useApp();

  const [loginMutation, { isLoading, isError, error }] = useLoginMutation();

  const login = async (data: LoginRequest) => {
    try {
      const response = await loginMutation(data).unwrap();

      localStorage.setItem('access-token', response.accessToken);
      localStorage.setItem('refresh-token', response.refreshToken);
      appDispatch(setCredentials({ email: response.email }));
    } catch {
      notification.error({ message: 'Неправильна адреса електронної пошти або пароль' });

      localStorage.removeItem('access-token');
      localStorage.removeItem('refresh-token');
    }
  };

  return { login, isLoading, isError, error };
}
