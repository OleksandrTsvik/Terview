import { api } from '@/api';
import { authSlice } from '@/auth/auth.slice';

const reducer = {
  [api.reducerPath]: api.reducer,
  [authSlice.name]: authSlice.reducer,
};

export default reducer;
