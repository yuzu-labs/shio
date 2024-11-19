import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Transcript } from '../../models/transcript';
import { VideoMetadata } from '../../models/report';
import { SystemError } from '../../models/global';

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
    loadTranscriptFail(state, action: PayloadAction<SystemError>) {},
    updateTranscript(state, action: PayloadAction<Transcript>) {
      state.transcript = action.payload;
    },
    loadOverview(state, action: PayloadAction<Transcript>) {},
    loadOverviewFail(state, action: PayloadAction<SystemError>) {},
    updateOverview(state, action: PayloadAction<string>) {
      state.overview = action.payload;
    },
  },
});

export const reportActions = ReportSlice.actions;

export default ReportSlice.reducer;
