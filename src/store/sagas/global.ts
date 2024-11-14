import { put } from 'redux-saga/effects';
import { globalActions, reportActions } from '../reducers';

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
