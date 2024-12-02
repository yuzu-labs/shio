import { all, call, delay, put, select, take } from 'redux-saga/effects';
import { globalActions, reportActions } from '../reducers';
import { authAPI } from '../apis';
import { PayloadAction } from '@reduxjs/toolkit';
import { AESClient, RSAEncryptionClient } from '../../utils/crypto';
import { AuthAPIResponse, BaseAPIResponse, YoutubeAPIResponse } from '../../models/api';
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
      yield put(globalActions.checkLoginFail());
      return;
    }

    // delay for 10ms to wait for second render to actually loadd the AES key
    yield delay(10);

    const aesClient: AESClient = yield call(AESClient.getInstance);
    const decryptedToken: string = yield call([aesClient, aesClient.decrypt], encryptedToken);
    const token: BearerToken = JSON.parse(decryptedToken);

    // Check if the token is expired
    if (token.expiredAt < Date.now()) {
      yield put(globalActions.checkLoginFail());
      return;
    }

    const response: BaseAPIResponse = yield call(authAPI.check, token.accessToken);

    if (!response.status) {
      yield put(globalActions.checkLoginFail());
      return;
    }

    yield put(globalActions.checkLoginSuccess(token));
  } catch (e: unknown) {
    if (e instanceof Error) {
      const error = e as Error;
      console.error('An error occurred:', error);
    } else {
      console.error('An unexpected error occurred:', e);
    }

    yield put(globalActions.checkLoginFail());
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
        // fire load action items action
        yield put(reportActions.loadActionItems(transcript));
      }),
      call(function* () {
        // delay and update summarizer state
        yield delay(1000);
        yield put(globalActions.updateSummarizerState(SummarizerState.OVERVIEW_LOADING));
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

    yield put(globalActions.updateSummarizerState(SummarizerState.KEYPOINT_LOADING));

    // wait for the key points to be updated
    const { type: keyPointsType, payload: keyPointsPayload } = yield take([
      reportActions.updateKeyPoints.type,
      reportActions.loadKeyPointsFail.type,
    ]);

    // handle exception
    if (keyPointsType === reportActions.loadKeyPointsFail.type) {
      const error = keyPointsPayload as SystemError;
      systemError = { ...systemError, title: error.title, content: error.content, code: error.code };
      yield put(globalActions.loadSummaryFail(systemError));
      return;
    }

    const keyPoints: string[] | undefined = yield select((state: RootState) => state.report.keyPoints);

    if (!keyPoints) {
      systemError = {
        ...systemError,
        title: 'Key Points Not Found',
        content: 'Error occurred while fetching key points',
        code: SystemErrorCode.SUMMARIZES_OTHER_ERROR,
      };
      yield put(globalActions.loadSummaryFail(systemError));
      return;
    }

    yield put(globalActions.updateSummarizerState(SummarizerState.ACTION_ITEMS_LOADING));

    // wait for the action items to be updated
    const { type: actionItemsType, payload: actionItemsPayload } = yield take([
      reportActions.updateActionItems.type,
      reportActions.loadActionItemsFail.type,
    ]);

    // handle exception
    if (actionItemsType === reportActions.loadActionItemsFail.type) {
      const error = actionItemsPayload as SystemError;
      systemError = { ...systemError, title: error.title, content: error.content, code: error.code };
      yield put(globalActions.loadSummaryFail(systemError));
      return;
    }

    const actionItems: string[] | undefined = yield select((state: RootState) => state.report.actionItems);

    if (!actionItems) {
      systemError = {
        ...systemError,
        title: 'Action Items Not Found',
        content: 'Error occurred while fetching action items',
        code: SystemErrorCode.SUMMARIZES_OTHER_ERROR,
      };
      yield put(globalActions.loadSummaryFail(systemError));
      return;
    }

    yield put(globalActions.updateSummarizerState(SummarizerState.DONE));

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

export function* globalClearSummarizer() {
  console.log('[saga] global - Clear Summarizer');

  // wait for 1s before clearing the report
  yield delay(1000);
  yield put(reportActions.clearReport());
}
