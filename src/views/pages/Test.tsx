import React, { useRef } from 'react';
import './Test.scss';
import { globalActions, reportActions } from '../../store/reducers';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';

type Props = {};

const Test = (props: Props) => {
  const { loading, token } = useSelector((state: RootState) => state.global);
  const { transcript } = useSelector((state: RootState) => state.report);
  const dispatch = useDispatch();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  return (
    <div className="test-container">
      <textarea ref={textAreaRef} name="raw-text" id="raw-text"></textarea>
      <button
        id="summarize"
        onClick={() => {
          // vr9Rd8tNjTs
          const text = textAreaRef.current?.value;
          if (!text) return;
          console.log('Summarize:', text);
          dispatch(globalActions.loadSummarize({ videoId: text }));
        }}>
        Summarize
      </button>
      <button
        id="overview"
        onClick={() => {
          dispatch(reportActions.loadOverview(transcript ?? { videoId: '', textSections: [] }));
        }}>
        Load Overview
      </button>
      <button id="toast" onClick={() => dispatch(globalActions.openErrorToast())}>
        Open Toast
      </button>
      <pre>{loading.toString()}</pre>
      <pre>{JSON.stringify(token, null, 4)}</pre>
      <pre>{JSON.stringify(transcript, null, 4)}</pre>
    </div>
  );
};

export default Test;
