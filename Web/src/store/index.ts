import { configureStore } from '@reduxjs/toolkit';

import { api } from '../api';
import reducer from './reducer';
import { IS_DEVELOPMENT } from '../common/node-env.constants';

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
  devTools: IS_DEVELOPMENT,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
