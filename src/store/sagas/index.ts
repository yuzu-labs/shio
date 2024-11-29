import { all, takeEvery } from 'redux-saga/effects';
import { globalCheckLogin, globalLoadSummary, globalLogin } from './global';
import { globalActions, reportActions } from '../reducers';
import { reportLoadActionItems, reportLoadKeyPoints, reportLoadOverview, reportLoadTranscript } from './report';

export default function* rootSaga() {
  yield all([
    // global
    takeEvery(globalActions.checkLogin.type, globalCheckLogin),
    takeEvery(globalActions.login.type, globalLogin),
    takeEvery(globalActions.loadSummary.type, globalLoadSummary),

    // report
    takeEvery(reportActions.loadTranscript.type, reportLoadTranscript),
    takeEvery(reportActions.loadOverview.type, reportLoadOverview),
    takeEvery(reportActions.loadKeyPoints.type, reportLoadKeyPoints),
    takeEvery(reportActions.loadActionItems.type, reportLoadActionItems),
  ]);
}
