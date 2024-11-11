import { createSlice } from '@reduxjs/toolkit';

interface GlobalState {
  loading: boolean;
}

const initialState: GlobalState = {
  loading: false,
};

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    loadSummarize(state) {
      state.loading = true;
    },
    loadSummarizeSuccess(state) {
      state.loading = false;
    },
    loadSummarizeFail(state) {
      state.loading = false;
    },
  },
});

export const globalActions = globalSlice.actions;

export default globalSlice.reducer;
