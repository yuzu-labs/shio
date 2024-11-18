import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagas';
import { globalReducer, reportReducer } from './reducers';

const saga = createSagaMiddleware();

const store = configureStore({
  reducer: {
    global: globalReducer,
    report: reportReducer,
  },
  middleware: (gDM) => gDM().concat(saga),
});

saga.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;

export default store;
