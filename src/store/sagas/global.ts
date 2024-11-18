import { call, put } from 'redux-saga/effects';
import { globalActions, reportActions } from '../reducers';
import { authAPI } from '../apis';
import { PayloadAction } from '@reduxjs/toolkit';
import { AESClient, RSAEncryptionClient } from '../../utils/crypto';
import { AuthAPIResponse } from '../../models/api';
import { AxiosError } from 'axios';
import { SystemError } from '../../models/global';
import { BearerToken } from '../../models/auth';

export function* globalCheckLogin() {
  console.log('[saga] global - Check Login');

  try {
    const encryptedToken: string | null = localStorage.getItem('token');

    if (!encryptedToken) {
      throw new Error('Token not found');
    }

    const aesClient: AESClient = yield call(AESClient.getInstance);
    const decryptedToken: string = yield call([aesClient, aesClient.decrypt], encryptedToken);
    const token: BearerToken = JSON.parse(decryptedToken);

    // Check if the token is expired
    if (token.expiredAt < Date.now()) {
      throw new Error('Token expired');
    }

    yield put(globalActions.loginSuccess(token));
  } catch (e: unknown) {
    let systemError: SystemError = { relatedAction: globalActions.checkLogin.type, title: '', content: '' };

    if (e instanceof Error) {
      const error = e as Error;
      systemError = { ...systemError, title: e.name ?? 'Error', content: error.message };
    } else {
      console.error('An unexpected error occurred:', e);
      systemError = { ...systemError, title: 'Error', content: 'An unexpected error occurred' };
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
    let systemError: SystemError = { relatedAction: globalActions.login.type, title: '', content: '' };

    if (e instanceof DOMException && e.name === 'OperationError') {
      const error = e as DOMException;
      systemError = {
        ...systemError,
        title: 'Encryption Error',
        content: 'An error occurred while encrypting the login credentials',
      };
      console.error('Encryption operation failed:', error);
    } else if (e instanceof AxiosError) {
      const error = e as AxiosError;
      if (error.response && error.response.status === 401) {
        systemError = { ...systemError, title: 'Unauthorized', content: 'Invalid login credentials' };
      } else {
        systemError = {
          ...systemError,
          title: 'Network Error',
          content: 'An error occurred while talking to the server',
        };
      }
    } else {
      console.error('An unexpected error occurred:', e);
      systemError = { ...systemError, title: 'Error', content: 'An unexpected error occurred' };
    }
    yield put(globalActions.loginFail(systemError));
  }
}

export function* globalLoadSummarize(action: PayloadAction<{ videoId: string }>) {
  console.log('[saga] global - Load Summarize');

  try {
    // fire load transcript action
    yield put(reportActions.loadTranscript({ videoId: action.payload.videoId }));

    yield put(globalActions.loadSummarizeSuccess());
  } catch (e: unknown) {
    let systemError: SystemError = { relatedAction: globalActions.loadSummarize.type, title: '', content: '' };

    if (e instanceof AxiosError) {
      const error = e as AxiosError;
      if (error.response && error.response.status === 401) {
        systemError = { ...systemError, title: 'Unauthorized', content: 'Invalid login credentials' };
      } else {
        systemError = {
          ...systemError,
          title: 'Network Error',
          content: 'An error occurred while talking to the server',
        };
      }
    } else {
      console.error('An unexpected error occurred:', e);
      systemError = { ...systemError, title: 'Error', content: 'An unexpected error occurred' };
    }

    yield put(globalActions.loadSummarizeFail(systemError));
  }
}
