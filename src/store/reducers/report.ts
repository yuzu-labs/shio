import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Transcript } from '../../models/transcript';

interface ReportState {
  video?: string;
  transcript?: Transcript;
}

const initialState: ReportState = {};

const ReportSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {
    updateTranscript(state, action: PayloadAction<Transcript>) {
      state.transcript = action.payload;
    },
  },
});

export const ReportActions = ReportSlice.actions;

export default ReportSlice.reducer;
