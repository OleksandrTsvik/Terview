import { useAppDispatch } from '@/hooks/redux-hooks';

import { useLogoutMutation } from './auth.api';
import { resetAuthState } from './auth.slice';

export default function useLogout() {
  const appDispatch = useAppDispatch();
  const [logoutMutation, { isLoading, isError, error }] = useLogoutMutation();

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh-token');

      if (refreshToken) {
        await logoutMutation({ refreshToken }).unwrap();
      }
    } finally {
      localStorage.removeItem('access-token');
      localStorage.removeItem('refresh-token');
      appDispatch(resetAuthState());
    }
  };

  return { logout, isLoading, isError, error };
}
