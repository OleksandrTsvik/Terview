import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { RootState } from '@/store';

import { TagsState } from './tags.models';

const initialState: TagsState = {};

export const tagsSlice = createSlice({
  name: 'tagsSlice',
  initialState,
  reducers: {
    selectUpdateTag: (state, { payload }: PayloadAction<string>) => {
      state.selectedUpdateTag = payload;
    },
    clearSelectedUpdateTag: (state) => {
      state.selectedUpdateTag = undefined;
    },
  },
});

export const { selectUpdateTag, clearSelectedUpdateTag } = tagsSlice.actions;

export const selectTagsState = (state: RootState) => state.tagsSlice;
