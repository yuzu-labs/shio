import { put } from 'redux-saga/effects';
import { globalActions } from '../reducers/global';

export function* globalloadSummarize() {
  console.log('[saga] global - Load Summarize');

  try {
    // call APIs

    yield put(globalActions.loadSummarizeSuccess());
  } catch (e: unknown) {
    console.error(e);
    yield put(globalActions.loadSummarizeFail());
  }
}
