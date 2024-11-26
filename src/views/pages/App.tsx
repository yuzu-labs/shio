import React, { useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/joy';
import { LandingContainer, LoadingContainer, ReportContainer } from '../../components/summarizer';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './App.scss';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { SummarizerState } from '../../models/enum/global';

function App() {
  const [activeContainer, setActiveContainer] = useState<'landing' | 'loading' | 'report'>('loading');
  const { summarizerState } = useSelector((state: RootState) => state.global);

  useEffect(() => {
    switch (summarizerState) {
      case SummarizerState.INITIAL:
        setActiveContainer('landing');
        break;

      case SummarizerState.DIALOGUE_LOADING:
        setActiveContainer('loading');
        break;

      case SummarizerState.OVERVIEW_ACTION_ITEM_LOADING:
      case SummarizerState.KEYPOINT_LOADING:
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
      <TransitionGroup component={null}>
        <CSSTransition key={activeContainer} timeout={500} classNames="fade" unmountOnExit mountOnEnter>
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
        </CSSTransition>
      </TransitionGroup>
    </>
  );
}

export default App;
