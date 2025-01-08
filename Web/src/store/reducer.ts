import { api } from '@/api';
import { authSlice } from '@/auth/auth.slice';
import { schedulerSlice } from '@/features/scheduler-page/scheduler.slice';
import { tagsSlice } from '@/features/tags-page/tags.slice';
import { usersSlice } from '@/features/users-page/users.slice';

const reducer = {
  [api.reducerPath]: api.reducer,
  [authSlice.name]: authSlice.reducer,
  [schedulerSlice.name]: schedulerSlice.reducer,
  [tagsSlice.name]: tagsSlice.reducer,
  [usersSlice.name]: usersSlice.reducer,
};

export default reducer;
