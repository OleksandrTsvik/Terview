import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { RootState } from '@/store';

import { JobResponse, SchedulerState } from './scheduler.models';

const initialState: SchedulerState = {};

export const schedulerSlice = createSlice({
  name: 'schedulerSlice',
  initialState,
  reducers: {
    selectUpdateJobPeriod: (state, { payload }: PayloadAction<JobResponse>) => {
      state.selectedUpdateJobPeriod = payload;
    },
    clearSelectedUpdateJobPeriod: (state) => {
      state.selectedUpdateJobPeriod = undefined;
    },
  },
});

export const { selectUpdateJobPeriod, clearSelectedUpdateJobPeriod } = schedulerSlice.actions;

export const selectSchedulerState = (state: RootState) => state.schedulerSlice;
