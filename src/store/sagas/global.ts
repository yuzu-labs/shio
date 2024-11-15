import { call, put } from 'redux-saga/effects';
import { globalActions, reportActions } from '../reducers';
import { authAPI } from '../apis';
import { PayloadAction } from '@reduxjs/toolkit';
import { RSAEncryptionClient } from '../../utils/crypto';
import { AuthAPIResponse } from '../../models/api';

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

    // fire login success action
    yield put(globalActions.loginSuccess(response.token));
  } catch (e: unknown) {
    if (e instanceof DOMException && e.name === 'OperationError') {
      const error = e as DOMException;
      console.error('Encryption operation failed:', error);
    } else {
      console.error('An unexpected error occurred:', e);
    }
    yield put(globalActions.loginFail());
  }
}

export function* globalLoadSummarize() {
  console.log('[saga] global - Load Summarize');

  try {
    // fire load transcript action
    yield put(reportActions.loadTranscript({ videoId: '04k9vRWLRzI' }));

    yield put(globalActions.loadSummarizeSuccess());
  } catch (e: unknown) {
    console.error(e);
    yield put(globalActions.loadSummarizeFail());
  }
}
