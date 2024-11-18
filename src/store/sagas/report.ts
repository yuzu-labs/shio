import { PayloadAction } from '@reduxjs/toolkit';
import { call } from 'redux-saga/effects';
import { reportAPI } from '../apis';
import { VideoMetadata } from '../../models/report';

export function* reportLoadTranscript(action: PayloadAction<VideoMetadata>) {
  console.log('[saga] report - Load Transcript');

  try {
    const response: string = yield call(reportAPI.getTranscript, action.payload.videoId);

    console.log('Transcript loaded');
    console.log(response);
  } catch (e: unknown) {
    console.error(e);
    // yield put(reportActions.loadTranscriptFail());
  }
}
