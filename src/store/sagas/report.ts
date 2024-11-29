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

    const rawText = response.data.textSections.map((section) => section.text).join(' ');
    const transcript: Transcript = {
      ...response.data,
      rawText,
    };

    if (!transcript || !transcript.videoId) {
      systemError = {
        ...systemError,
        title: 'Invalid Transcript',
        content: 'Invalid transcript',
        code: SystemErrorCode.SUMMARIZES_OTHER_ERROR,
      };
      yield put(reportActions.loadTranscriptFail(systemError));
      return;
    }

    if (!transcript.rawText) {
      systemError = {
        ...systemError,
        title: 'Empty Transcript',
        content: 'No text to summarize',
        code: SystemErrorCode.DIALOGUE_NOT_FOUND,
      };
      yield put(reportActions.loadTranscriptFail(systemError));
      return;
    }

    console.log(`Total characters in transcript: ${transcript.rawText.length}`);

    if (transcript.rawText.length > 4000) {
      systemError = {
        ...systemError,
        title: 'Text Too Long',
        content: 'Text is too long (over 4000 characters) to summarize',
        code: SystemErrorCode.SUMMARIZES_OTHER_ERROR,
      };
      yield put(reportActions.loadTranscriptFail(systemError));
      return;
    }

    yield put(reportActions.updateTranscript(transcript));
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

    const text = action.payload.rawText;

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

export function* reportLoadKeyPoints(action: PayloadAction<Transcript>) {
  console.log('[saga] report - Load Key Points');

  let systemError: SystemError = {
    relatedAction: reportActions.loadKeyPoints.type,
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
      yield put(reportActions.loadKeyPointsFail(systemError));
      return;
    }

    const text = action.payload.rawText;

    const AIClient: ChromeAI.Client = yield call(ChromeAI.Client.getInstance);
    const rawKeyPoints: string = yield call([AIClient, AIClient.summarize], text, 'key-points', 'plain-text', 'medium');
    const keyPoints = rawKeyPoints
      .trim()
      .split('- ')
      .filter((point) => point);

    console.log('Key Points:', keyPoints);

    yield put(reportActions.updateKeyPoints(keyPoints));
  } catch (e: unknown) {
    const systemError: SystemError = {
      relatedAction: reportActions.loadTranscript.type,
      title: 'Key Points Load Error',
      content: e instanceof Error ? e.message : 'Unknown error',
      code: SystemErrorCode.SUMMARIZES_OTHER_ERROR,
    };
    yield put(reportActions.loadKeyPointsFail(systemError));
  }
}

export function* reportLoadActionItems(action: PayloadAction<Transcript>) {
  console.log('[saga] report - Load Action Items');

  const PROMPT_TEMPLATE = `
  Here is the transcript of a video:

  "{TRANSCRIPT}"

  I want to explore more on the topics mentioned in the video, please list out possible options for this context, at most 8 actions. Please return the list with '-' as the marker without any other content
  `;

  let systemError: SystemError = {
    relatedAction: reportActions.loadActionItems.type,
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
      yield put(reportActions.loadActionItemsFail(systemError));
      return;
    }

    const text = action.payload.rawText;

    const AIClient: ChromeAI.Client = yield call(ChromeAI.Client.getInstance);
    const rawActionItems: string = yield call(
      [AIClient, AIClient.promptAtOnce],
      PROMPT_TEMPLATE.replace('{TRANSCRIPT}', text)
    );
    const actionItems = rawActionItems
      .trim()
      .split('- ')
      .filter((item) => item);

    console.log('Action Items:', actionItems);

    yield put(reportActions.updateActionItems(actionItems));
  } catch (e: unknown) {
    const systemError: SystemError = {
      relatedAction: reportActions.loadTranscript.type,
      title: 'Action Items Load Error',
      content: e instanceof Error ? e.message : 'Unknown error',
      code: SystemErrorCode.SUMMARIZES_OTHER_ERROR,
    };
    yield put(reportActions.loadActionItemsFail(systemError));
  }
}
