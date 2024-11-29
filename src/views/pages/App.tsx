import React, { useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/joy';
import { LandingContainer, LoadingContainer, ReportContainer } from '../../components/summarizer';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { SummarizerState } from '../../models/enum/global';
import styles from './App.module.scss';
import { YuzuFadeInOut } from '../../components/transition';

function App() {
  const [activeContainer, setActiveContainer] = useState<'landing' | 'loading' | 'report'>('landing');
  const { summarizerState } = useSelector((state: RootState) => state.global);

  useEffect(() => {
    switch (summarizerState) {
      case SummarizerState.INITIAL:
        setActiveContainer('landing');
        break;

      case SummarizerState.DIALOGUE_LOADING:
      case SummarizerState.DIALOGUE_RECEIVED:
        setActiveContainer('loading');
        break;

      case SummarizerState.OVERVIEW_LOADING:
      case SummarizerState.KEYPOINT_LOADING:
      case SummarizerState.ACTION_ITEMS_LOADING:
      case SummarizerState.DONE:
        setActiveContainer('report');
        break;
    }
  }, [summarizerState]);

  const renderContainer = useMemo(() => {
    switch (activeContainer) {
      case 'landing':
        return <LandingContainer key="landing" />;
      case 'loading':
        return <LoadingContainer key="loading" />;
      case 'report':
        return <ReportContainer key="report" />;
      default:
        return null;
    }
  }, [activeContainer]);

  return (
    <>
      <div
        className={styles['mesh-container']}
        aria-hidden="true"
        style={{ opacity: activeContainer !== 'loading' ? 0 : 1 }}>
        <div id={styles['bg-shape1']} className={styles['mesh-shape']}></div>
        <div id={styles['bg-shape2']} className={styles['mesh-shape']}></div>
        <div id={styles['bg-shape3']} className={styles['mesh-shape']}></div>
      </div>
      <YuzuFadeInOut nodeKey={activeContainer}>
        <Box
          sx={{
            position: 'absolute', // Absolute positioning
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}>
          {renderContainer}
        </Box>
      </YuzuFadeInOut>
    </>
  );
}

export default App;
