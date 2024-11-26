import { PayloadAction } from '@reduxjs/toolkit';
import { call, put } from 'redux-saga/effects';
import { reportAPI } from '../apis';
import { VideoMetadata } from '../../models/report';
import { TranscriptAPIResponse } from '../../models/api';
import { reportActions } from '../reducers';
import { Transcript } from '../../models/transcript';
import { ChromeAI } from '../../utils/ai';
import { SystemError } from '../../models/global';
import { SystemErrorCode } from '../../models/enum/global';

export function* reportLoadTranscript(action: PayloadAction<VideoMetadata>) {
  console.log('[saga] report - Load Transcript');

  let systemError: SystemError = {
    relatedAction: reportActions.loadTranscript.type,
    title: '',
    content: '',
    code: SystemErrorCode.TRANSCRIPTION_ERROR,
  };

  try {
    const response: TranscriptAPIResponse = yield call(reportAPI.getTranscript, action.payload.videoId);

    if (!response.status) {
      systemError = {
        ...systemError,
        title: 'Transcript Not Found',
        content: 'Error occurred while fetching transcript',
        code: SystemErrorCode.DIALOGUE_NOT_FOUND,
      };
      yield put(reportActions.loadTranscriptFail(systemError));
      return;
    }

    yield put(reportActions.updateTranscript(response.data));
  } catch (e: unknown) {
    const systemError: SystemError = {
      relatedAction: reportActions.loadTranscript.type,
      title: 'Transcript Load Error',
      content: e instanceof Error ? e.message : 'Unknown error',
      code: SystemErrorCode.TRANSCRIPTION_ERROR,
    };
    yield put(reportActions.loadTranscriptFail(systemError));
  }
}

export function* reportLoadOverview(action: PayloadAction<Transcript>) {
  console.log('[saga] report - Load Overview');

  let systemError: SystemError = {
    relatedAction: reportActions.loadOverview.type,
    title: '',
    content: '',
    code: SystemErrorCode.SUMMARIZES_OTHER_ERROR,
  };

  try {
    if (!action.payload || !action.payload.videoId) {
      systemError = {
        ...systemError,
        title: 'Invalid Transcript',
        content: 'Invalid transcript',
        code: SystemErrorCode.SUMMARIZES_OTHER_ERROR,
      };
      yield put(reportActions.loadOverviewFail(systemError));
      return;
    }

    const text: string = action.payload.textSections.map((section) => section.text).join(' ');

    if (!text) {
      systemError = {
        ...systemError,
        title: 'Empty Transcript',
        content: 'No text to summarize',
        code: SystemErrorCode.DIALOGUE_NOT_FOUND,
      };
      yield put(reportActions.loadOverviewFail(systemError));
      return;
    }

    console.log(`Total characters in transcript: ${text.length}`);

    if (text.length > 4000) {
      systemError = {
        ...systemError,
        title: 'Text Too Long',
        content: 'Text is too long (over 4000 characters) to summarize',
        code: SystemErrorCode.SUMMARIZES_OTHER_ERROR,
      };
      yield put(reportActions.loadOverviewFail(systemError));
      return;
    }

    const AIClient: ChromeAI.Client = yield call(ChromeAI.Client.getInstance);
    const overview: string = yield call([AIClient, AIClient.summarize], text, 'headline', 'plain-text', 'medium');

    console.log('Overview:', overview);

    yield put(reportActions.updateOverview(overview));
  } catch (e: unknown) {
    const systemError: SystemError = {
      relatedAction: reportActions.loadTranscript.type,
      title: 'Overview Load Error',
      content: e instanceof Error ? e.message : 'Unknown error',
      code: SystemErrorCode.SUMMARIZES_OTHER_ERROR,
    };
    yield put(reportActions.loadOverviewFail(systemError));
  }
}
