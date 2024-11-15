import React from 'react';
import './Test.scss';
import { globalActions } from '../../store/reducers';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { TEST_LOGIN_PLAIN_TEXT } from '../../utils/config';

type Props = {};

const Test = (props: Props) => {
  const loading = useSelector((state: RootState) => state.global.loading);
  const dispatch = useDispatch();

  return (
    <div className="test-container">
      <textarea name="raw-text" id="raw-text"></textarea>
      <button
        id="login"
        onClick={() => {
          dispatch(globalActions.login({ loginPlainText: TEST_LOGIN_PLAIN_TEXT || '' }));
        }}>
        Login
      </button>
      <button
        id="summarize"
        onClick={() => {
          console.log('Summarize button clicked');
          dispatch(globalActions.loadSummarize());
        }}>
        Summarize
      </button>
      <pre>{loading.toString()}</pre>
    </div>
  );
};

export default Test;
