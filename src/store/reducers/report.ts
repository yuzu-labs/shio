import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Transcript } from '../../models/transcript';
import { VideoMetadata } from '../../models/report';

interface ReportState {
  video?: string;
  transcript?: Transcript;
}

const initialState: ReportState = {};

const ReportSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {
    loadTranscript(state, action: PayloadAction<VideoMetadata>) {},
    updateTranscript(state, action: PayloadAction<Transcript>) {
      state.transcript = action.payload;
    },
  },
});

export const reportActions = ReportSlice.actions;

export default ReportSlice.reducer;
