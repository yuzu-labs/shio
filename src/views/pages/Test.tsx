import React from 'react';
import './Test.scss';
import { globalActions } from '../../store/reducers';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';

type Props = {};

const Test = (props: Props) => {
  const { loading, token } = useSelector((state: RootState) => state.global);
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
      <pre>{JSON.stringify(token, null, 4)}</pre>
    </div>
  );
};

export default Test;
