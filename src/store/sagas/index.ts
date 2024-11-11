import { all, takeEvery } from 'redux-saga/effects';
import { globalActions } from '../reducers/global';
import { globalloadSummarize } from './global';

export default function* rootSaga() {
  yield all([
    // global
    takeEvery(globalActions.loadSummarize.type, globalloadSummarize),
  ]);
}
