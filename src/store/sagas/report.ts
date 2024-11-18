import { PayloadAction } from '@reduxjs/toolkit';
import { call, put } from 'redux-saga/effects';
import { reportAPI } from '../apis';
import { VideoMetadata } from '../../models/report';
import { TranscriptAPIResponse } from '../../models/api';
import { reportActions } from '../reducers';
export function* reportLoadTranscript(action: PayloadAction<VideoMetadata>) {
  console.log('[saga] report - Load Transcript');

  try {
    const response: TranscriptAPIResponse = yield call(reportAPI.getTranscript, action.payload.videoId);

    if (!response.status) {
      throw new Error('Failed to load transcript');
    }

    yield put(reportActions.updateTranscript(response.data));
  } catch (e: unknown) {
    throw e;
  }
}
