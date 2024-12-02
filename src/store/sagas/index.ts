import { all, takeEvery, takeLatest } from 'redux-saga/effects';
import {
  globalCheckAICompatibility,
  globalCheckLogin,
  globalClearSummarizer,
  globalLoadSummary,
  globalLoadSummaryFail,
  globalLogin,
} from './global';
import { globalActions, reportActions } from '../reducers';
import { reportLoadActionItems, reportLoadKeyPoints, reportLoadOverview, reportLoadTranscript } from './report';

export default function* rootSaga() {
  yield all([
    // global
    takeLatest(globalActions.checkLogin.type, globalCheckLogin),
    takeLatest(globalActions.checkAICompatibility.type, globalCheckAICompatibility),
    takeLatest(globalActions.login.type, globalLogin),
    takeLatest(globalActions.loadSummary.type, globalLoadSummary),
    takeEvery(globalActions.clearSummarizer.type, globalClearSummarizer),
    takeEvery(globalActions.loadSummaryFail.type, globalLoadSummaryFail),

    // report
    takeEvery(reportActions.loadTranscript.type, reportLoadTranscript),
    takeEvery(reportActions.loadOverview.type, reportLoadOverview),
    takeEvery(reportActions.loadKeyPoints.type, reportLoadKeyPoints),
    takeEvery(reportActions.loadActionItems.type, reportLoadActionItems),
  ]);
}
