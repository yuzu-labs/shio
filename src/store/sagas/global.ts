import { all, call, delay, put, select, take } from 'redux-saga/effects';
import { globalActions, reportActions } from '../reducers';
import { authAPI } from '../apis';
import { PayloadAction } from '@reduxjs/toolkit';
import { AESClient, RSAEncryptionClient } from '../../utils/crypto';
import { AuthAPIResponse, YoutubeAPIResponse } from '../../models/api';
import { AxiosError } from 'axios';
import { SystemError } from '../../models/global';
import { BearerToken } from '../../models/auth';
import youtubeAPI from '../apis/youtube';
import { RootState } from '..';
import { Transcript } from '../../models/transcript';
import { SummarizerState, SystemErrorCode } from '../../models/enum/global';

export function* globalCheckLogin() {
  console.log('[saga] global - Check Login');

  try {
    const encryptedToken: string | null = localStorage.getItem('token');

    if (!encryptedToken) {
      yield put(globalActions.logout());
      return;
    }

    const aesClient: AESClient = yield call(AESClient.getInstance);
    const decryptedToken: string = yield call([aesClient, aesClient.decrypt], encryptedToken);
    const token: BearerToken = JSON.parse(decryptedToken);

    // Check if the token is expired
    if (token.expiredAt < Date.now()) {
      yield put(globalActions.logout());
      return;
    }

    yield put(globalActions.loginSuccess(token));
  } catch (e: unknown) {
    let systemError: SystemError = {
      relatedAction: globalActions.checkLogin.type,
      title: '',
      content: '',
      code: SystemErrorCode.SYSTEM_OTHER_ERROR,
    };

    if (e instanceof Error) {
      const error = e as Error;
      systemError = {
        ...systemError,
        title: e.name ?? 'Error',
        content: error.message,
        code: SystemErrorCode.SYSTEM_OTHER_ERROR,
      };
    } else {
      console.error('An unexpected error occurred:', e);
      systemError = {
        ...systemError,
        title: 'Error',
        content: 'An unexpected error occurred',
        code: SystemErrorCode.SYSTEM_OTHER_ERROR,
      };
    }

    yield put(globalActions.loginFail(systemError));
  }
}

export function* globalLogin(action: PayloadAction<{ loginPlainText: string }>) {
  console.log('[saga] global - Login');

  try {
    const encryptionClient: RSAEncryptionClient = yield call(RSAEncryptionClient.getInstance);
    const loginCipherString: string = yield call(
      [encryptionClient, encryptionClient.encrypt],
      action.payload.loginPlainText
    );

    const response: AuthAPIResponse = yield call(authAPI.login, loginCipherString);

    if (!response.status) {
      throw new Error('Login failed');
    }

    // Encrypt the token
    const aesClient: AESClient = yield call(AESClient.getInstance);

    const tokenString: string = JSON.stringify(response.token);
    const encryptedToken: string = yield call([aesClient, aesClient.encrypt], tokenString);

    // Save the encrypted token to local storage
    if (localStorage.getItem('token')) {
      localStorage.removeItem('token');
    }
    localStorage.setItem('token', encryptedToken);

    yield put(globalActions.loginSuccess(response.token));
  } catch (e: unknown) {
    let systemError: SystemError = {
      relatedAction: globalActions.login.type,
      title: '',
      content: '',
      code: SystemErrorCode.SYSTEM_OTHER_ERROR,
    };

    if (e instanceof DOMException && e.name === 'OperationError') {
      const error = e as DOMException;
      systemError = {
        ...systemError,
        title: 'Encryption Error',
        content: 'An error occurred while encrypting the login credentials',
        code: SystemErrorCode.SYSTEM_OTHER_ERROR,
      };
      console.error('Encryption operation failed:', error);
    } else if (e instanceof AxiosError) {
      const error = e as AxiosError;
      if (error.response && error.response.status === 401) {
        systemError = {
          ...systemError,
          title: 'Unauthorized',
          content: 'Invalid login credentials',
          code: SystemErrorCode.PASSWORD_UNMATCHED,
        };
      } else {
        systemError = {
          ...systemError,
          title: 'Network Error',
          content: 'An error occurred while talking to the server',
          code: SystemErrorCode.CONNECTION_FAILED,
        };
      }
    } else {
      console.error('An unexpected error occurred:', e);
      systemError = {
        ...systemError,
        title: 'Error',
        content: 'An unexpected error occurred',
        code: SystemErrorCode.SYSTEM_OTHER_ERROR,
      };
    }
    yield put(globalActions.loginFail(systemError));
  }
}

export function* globalLoadSummary(action: PayloadAction<{ videoId: string }>) {
  console.log('[saga] global - Load Summarize');

  let systemError: SystemError = {
    relatedAction: globalActions.loadSummary.type,
    title: '',
    content: '',
    code: SystemErrorCode.SYSTEM_OTHER_ERROR,
  };

  try {
    const response: YoutubeAPIResponse.Video = yield call(youtubeAPI.getVideos, action.payload.videoId, 'id');

    if (!response.status || response.videos.pageInfo.totalResults === 0) {
      systemError = {
        ...systemError,
        title: 'Video Not Found',
        content: 'Youtube video not found',
        code: SystemErrorCode.VIDEO_NOT_FOUND,
      };
      yield put(globalActions.loadSummaryFail(systemError));
      return;
    }

    // fire load transcript action
    yield put(reportActions.loadTranscript({ videoId: action.payload.videoId }));

    // wait for the transcript to be updated
    const { type: transcriptType, payload: transcriptPayload } = yield take([
      reportActions.updateTranscript.type,
      reportActions.loadTranscriptFail.type,
    ]);

    // handle exception
    if (transcriptType === reportActions.loadOverviewFail.type) {
      const error = transcriptPayload as SystemError;
      systemError = { ...systemError, title: error.title, content: error.content, code: error.code };
      yield put(globalActions.loadSummaryFail(systemError));
      return;
    }

    const transcript: Transcript | undefined = yield select((state: RootState) => state.report.transcript);

    if (!transcript) {
      systemError = {
        ...systemError,
        title: 'Transcript Not Found',
        content: 'Error occurred while fetching transcript',
        code: SystemErrorCode.DIALOGUE_NOT_FOUND,
      };
      yield put(globalActions.loadSummaryFail(systemError));
      return;
    }

    // update summarizer state
    yield put(globalActions.updateSummarizerState(SummarizerState.DIALOGUE_RECEIVED));

    // load overview while switching to report page after a 1s delay
    yield all([
      call(function* () {
        // fire load overview action
        yield put(reportActions.loadOverview(transcript));
      }),
      call(function* () {
        // fire load key points action
        yield put(reportActions.loadKeyPoints(transcript));
      }),
      call(function* () {
        // delay and update summarizer state
        yield delay(1000);
        yield put(globalActions.updateSummarizerState(SummarizerState.OVERVIEW_ACTION_ITEM_LOADING));
      }),
    ]);

    // wait for the overview to be updated
    const { type: overviewType, payload: overviewPayload } = yield take([
      reportActions.updateOverview.type,
      reportActions.loadOverviewFail.type,
    ]);

    // handle exception
    if (overviewType === reportActions.loadOverviewFail.type) {
      const error = overviewPayload as SystemError;
      systemError = { ...systemError, title: error.title, content: error.content, code: error.code };
      yield put(globalActions.loadSummaryFail(systemError));
      return;
    }

    const overview: string | undefined = yield select((state: RootState) => state.report.overview);

    if (!overview) {
      systemError = {
        ...systemError,
        title: 'Overview Not Found',
        content: 'Error occurred while fetching overview',
        code: SystemErrorCode.SUMMARIZES_OTHER_ERROR,
      };
      yield put(globalActions.loadSummaryFail(systemError));
      return;
    }

    yield put(globalActions.loadSummarySuccess());
  } catch (e: unknown) {
    if (e instanceof AxiosError) {
      const error = e as AxiosError;
      if (error.response && error.response.status === 401) {
        systemError = {
          ...systemError,
          title: 'Unauthorized',
          content: 'Authentication Failed',
          code: SystemErrorCode.SESSION_EXPIRED,
        };
      } else {
        systemError = {
          ...systemError,
          title: 'Network Error',
          content: 'An error occurred while talking to the server',
          code: SystemErrorCode.CONNECTION_FAILED,
        };
      }
    } else {
      console.error('An unexpected error occurred:', e);
      systemError = {
        ...systemError,
        title: 'Error',
        content: 'An unexpected error occurred',
        code: SystemErrorCode.SUMMARIZES_OTHER_ERROR,
      };
    }

    yield put(globalActions.loadSummaryFail(systemError));
  }
}
