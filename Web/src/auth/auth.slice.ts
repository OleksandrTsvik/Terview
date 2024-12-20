import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { RootState } from '@/store';

import { AuthState, AuthUser } from './auth.models';

const initialState: AuthState = {
  user: null,
};

export const authSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {
    setCredentials: (state, { payload }: PayloadAction<AuthUser>) => {
      state.user = payload;
    },
    resetAuthState: (state) => {
      state.user = null;
    },
  },
});

export const { setCredentials, resetAuthState } = authSlice.actions;

export const selectCurrentUser = (state: RootState) => state.authSlice.user;
