import { api } from '@/api';
import { authSlice } from '@/auth/auth.slice';
import { schedulerSlice } from '@/features/scheduler-page/scheduler.slice';

const reducer = {
  [api.reducerPath]: api.reducer,
  [authSlice.name]: authSlice.reducer,
  [schedulerSlice.name]: schedulerSlice.reducer,
};

export default reducer;
