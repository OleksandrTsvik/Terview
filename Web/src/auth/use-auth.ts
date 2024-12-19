import { useAppSelector } from '@/hooks/redux-hooks';

import { selectCurrentUser } from './auth.slice';

export default function useAuth() {
  const user = useAppSelector(selectCurrentUser);

  return {
    isAuth: !!user,
    user,
  };
}
