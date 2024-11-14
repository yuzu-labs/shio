import React from 'react';
import './Test.scss';
import { globalActions } from '../../store/reducers';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';

type Props = {};

const Test = (props: Props) => {
  const loading = useSelector((state: RootState) => state.global.loading);
  const dispatch = useDispatch();

  return (
    <div className="test-container">
      <textarea name="raw-text" id="raw-text"></textarea>
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
