import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { RootState } from '@/store';

import { UserResponse, UsersState } from './users.models';

const initialState: UsersState = {
  selectedUpdateUserPermissions: null,
};

export const usersSlice = createSlice({
  name: 'usersSlice',
  initialState,
  reducers: {
    selectUpdateUserPermissions: (state, { payload }: PayloadAction<UserResponse>) => {
      state.selectedUpdateUserPermissions = payload;
    },
    clearSelectedUpdateUserPermissions: (state) => {
      state.selectedUpdateUserPermissions = null;
    },
  },
});

export const { selectUpdateUserPermissions, clearSelectedUpdateUserPermissions } = usersSlice.actions;

export const selectUsersState = (state: RootState) => state.usersSlice;
