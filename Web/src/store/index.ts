import { configureStore } from '@reduxjs/toolkit';

import { api } from '@/api';
import { IS_DEVELOPMENT } from '@/common/node-env.constants';

import reducer from './reducer';

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
  devTools: IS_DEVELOPMENT,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
