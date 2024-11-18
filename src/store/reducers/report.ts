import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Transcript } from '../../models/transcript';
import { VideoMetadata } from '../../models/report';

interface ReportState {
  video?: string;
  transcript?: Transcript;
  overview?: string;
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
    loadOverview(state, action: PayloadAction<Transcript>) {},
    updateOverview(state, action: PayloadAction<string>) {
      state.overview = action.payload;
    },
  },
});

export const reportActions = ReportSlice.actions;

export default ReportSlice.reducer;
