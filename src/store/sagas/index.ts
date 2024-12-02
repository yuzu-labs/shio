import { all, takeEvery, takeLatest } from 'redux-saga/effects';
import {
  globalCheckAICompatibility,
  globalCheckLogin,
  globalClearSummarizer,
  globalLoadSummary,
  globalLogin,
} from './global';
import { globalActions, reportActions } from '../reducers';
import { reportLoadActionItems, reportLoadKeyPoints, reportLoadOverview, reportLoadTranscript } from './report';

export default function* rootSaga() {
  yield all([
    // global
    takeLatest(globalActions.checkLogin.type, globalCheckLogin),
    takeLatest(globalActions.checkAICompatibility.type, globalCheckAICompatibility),
    takeEvery(globalActions.login.type, globalLogin),
    takeEvery(globalActions.loadSummary.type, globalLoadSummary),
    takeEvery(globalActions.clearSummarizer.type, globalClearSummarizer),

    // report
    takeEvery(reportActions.loadTranscript.type, reportLoadTranscript),
    takeEvery(reportActions.loadOverview.type, reportLoadOverview),
    takeEvery(reportActions.loadKeyPoints.type, reportLoadKeyPoints),
    takeEvery(reportActions.loadActionItems.type, reportLoadActionItems),
  ]);
}
