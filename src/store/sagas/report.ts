import { PayloadAction } from '@reduxjs/toolkit';
import { call, put } from 'redux-saga/effects';
import { reportAPI } from '../apis';
import { VideoMetadata } from '../../models/report';
import { TranscriptAPIResponse } from '../../models/api';
import { reportActions } from '../reducers';
import { Transcript } from '../../models/transcript';
import { ChromeAI } from '../../utils/ai';

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

export function* reportLoadOverview(action: PayloadAction<Transcript>) {
  console.log('[saga] report - Load Overview');

  try {
    if (!action.payload || !action.payload.videoId) {
      throw new Error('Invalid transcript');
    }

    const text: string = action.payload.textSections.map((section) => section.text).join(' ');
    console.log(text);

    const AIClient: ChromeAI.Client = yield call(ChromeAI.Client.getInstance);
    const overview: string = yield call([AIClient, AIClient.summarize], text, 'headline', 'plain-text', 'medium');

    console.log('Overview:', overview);
  } catch (e: unknown) {
    throw e;
  }
}
