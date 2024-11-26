import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BearerToken } from '../../models/auth';
import { SystemError } from '../../models/global';

interface GlobalState {
  loading: boolean;
  isLoggedIn: boolean;
  errorToastOpen: boolean;
  error?: SystemError;
  token?: BearerToken;
}

const initialState: GlobalState = {
  loading: false,
  isLoggedIn: false,
  errorToastOpen: false,
};

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    loadSummarize(state, action: PayloadAction<{ videoId: string }>) {
      state.loading = true;
    },
    loadSummarizeSuccess(state) {
      state.loading = false;
    },
    loadSummarizeFail(state, action: PayloadAction<SystemError>) {
      state.loading = false;
      state.error = action.payload;
    },
    checkLogin(state) {
      state.loading = true;
    },
    login(state, action: PayloadAction<{ loginPlainText: string }>) {
      state.loading = true;
    },
    loginSuccess(state, action: PayloadAction<BearerToken>) {
      state.loading = false;
      state.isLoggedIn = true;
      state.token = action.payload;
    },
    loginFail(state, action: PayloadAction<SystemError>) {
      state.loading = false;
      state.isLoggedIn = false;
      state.error = action.payload;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.token = undefined;
    },
    openErrorToast(state) {
      state.errorToastOpen = true;
    },
    closeErrorToast(state) {
      state.errorToastOpen = false;
    },
  },
});

export const globalActions = globalSlice.actions;

export default globalSlice.reducer;
