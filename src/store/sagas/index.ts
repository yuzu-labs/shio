import { all, takeEvery } from 'redux-saga/effects';
import { globalCheckLogin, globalLoadSummarize, globalLogin } from './global';
import { globalActions, reportActions } from '../reducers';
import { reportLoadOverview, reportLoadTranscript } from './report';

export default function* rootSaga() {
  yield all([
    // global
    takeEvery(globalActions.checkLogin.type, globalCheckLogin),
    takeEvery(globalActions.login.type, globalLogin),
    takeEvery(globalActions.loadSummarize.type, globalLoadSummarize),

    // report
    takeEvery(reportActions.loadTranscript.type, reportLoadTranscript),
    takeEvery(reportActions.loadOverview.type, reportLoadOverview),
  ]);
}
