import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BearerToken } from '../../models/auth';

interface GlobalState {
  loading: boolean;
  isLoggedIn: boolean;
  token?: BearerToken;
}

const initialState: GlobalState = {
  loading: false,
  isLoggedIn: false,
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
    login(state, action: PayloadAction<{ loginPlainText: string }>) {
      state.loading = true;
    },
    loginSuccess(state, action: PayloadAction<BearerToken>) {
      state.loading = false;
      state.isLoggedIn = true;
      state.token = action.payload;
    },
    loginFail(state) {
      state.loading = false;
      state.isLoggedIn = false;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.token = undefined;
    },
  },
});

export const globalActions = globalSlice.actions;

export default globalSlice.reducer;
