import { useAppDispatch } from '@/hooks/redux-hooks';

import { useLogoutMutation } from './auth.api';
import { resetAuthState } from './auth.slice';
import { TokenProvider } from './token.provider';

export default function useLogout() {
  const appDispatch = useAppDispatch();
  const [logoutMutation, { isLoading, isError, error }] = useLogoutMutation();

  const logout = async () => {
    try {
      const refreshToken = TokenProvider.getRefreshToken();

      if (refreshToken) {
        await logoutMutation({ refreshToken }).unwrap();
      }
    } finally {
      TokenProvider.deleteAccessToken();
      TokenProvider.deleteRefreshToken();
      appDispatch(resetAuthState());
    }
  };

  return { logout, isLoading, isError, error };
}
