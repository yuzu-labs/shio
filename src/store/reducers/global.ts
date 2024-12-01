import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BearerToken } from '../../models/auth';
import { SystemError } from '../../models/global';
import { SummarizerState } from '../../models/enum/global';

interface GlobalState {
  loading: boolean;
  isLoggedIn: boolean;
  errorToastOpen: boolean;
  error?: SystemError;
  token?: BearerToken;

  // summarizer
  summarizerState: SummarizerState;
}

const initialState: GlobalState = {
  loading: false,
  isLoggedIn: false,
  errorToastOpen: false,

  summarizerState: SummarizerState.INITIAL,
};

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    // login
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
      if (localStorage.getItem('token')) {
        localStorage.removeItem('token');
      }

      state.loading = false;
      state.isLoggedIn = false;
      state.token = undefined;
    },

    // summarizer
    loadSummary(state, action: PayloadAction<{ videoId: string }>) {
      state.loading = true;
      state.summarizerState = SummarizerState.DIALOGUE_LOADING;
    },
    loadSummarySuccess(state) {
      state.loading = false;
      state.summarizerState = SummarizerState.DONE;
    },
    loadSummaryFail(state, action: PayloadAction<SystemError>) {
      state.loading = false;
      state.error = action.payload;
      state.summarizerState = SummarizerState.INITIAL;
    },
    updateSummarizerState(state, action: PayloadAction<SummarizerState>) {
      state.summarizerState = action.payload;
    },

    // error
    updateError(state, action: PayloadAction<SystemError>) {
      state.error = action.payload;
    },
    openErrorToast(state) {
      state.errorToastOpen = true;
    },
    closeErrorToast(state) {
      state.errorToastOpen = false;
    },

    // clear up
    clearSummarizer(state) {
      state.summarizerState = SummarizerState.INITIAL;
    },
  },
});

export const globalActions = globalSlice.actions;

export default globalSlice.reducer;
