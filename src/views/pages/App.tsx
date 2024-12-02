import React, { useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/joy';
import { LandingContainer, LoadingContainer, ReportContainer } from '../../components/summarizer';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { SummarizerState, SystemErrorCode } from '../../models/enum/global';
import styles from './App.module.scss';
import { YuzuFadeInOut } from '../../components/transition';
import { globalActions } from '../../store/reducers';
import { GeneralModal } from '../../components/feedback';
import { getGeneralModalContent } from '../../utils';

function App() {
  const [activeContainer, setActiveContainer] = useState<'landing' | 'loading' | 'report'>('landing');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');
  const [modalConfirmAction, setModalConfirmAction] = useState('');
  const [modalState, setModalState] = useState(SystemErrorCode.BROWSER_NOT_SUPPORTED);
  const { error, summarizerState } = useSelector((state: RootState) => state.global);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(globalActions.checkAICompatibility());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!error) return;

    // if error is not one of the following, ignore
    if (
      error.code !== SystemErrorCode.BROWSER_NOT_SUPPORTED &&
      error.code !== SystemErrorCode.VIDEO_TOO_LONG &&
      error.code !== SystemErrorCode.DIALOGUE_NOT_FOUND &&
      error.code !== SystemErrorCode.TRANSCRIPTION_ERROR &&
      error.code !== SystemErrorCode.LANGUAGE_NOT_SUPPORTED
    )
      return;

    const modalContent = getGeneralModalContent(error.code);

    setModalTitle(modalContent.title);
    setModalContent(modalContent.content);
    setModalConfirmAction(modalContent.confirmAction);
    setModalState(error.code);

    // Open modal
    setModalOpen(true);
  }, [error]);

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

  const handleModalConfirm = () => {
    if (modalState === SystemErrorCode.BROWSER_NOT_SUPPORTED) {
      window.open('https://developer.chrome.com/blog/august2024-summarization-ai');
      return;
    }
    setModalOpen(false);
  };

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
      <GeneralModal
        open={modalOpen}
        title={modalTitle}
        content={modalContent}
        color={modalState === SystemErrorCode.ALERT ? 'danger' : undefined}
        cancellable={modalState === SystemErrorCode.ALERT}
        confirmText={modalConfirmAction}
        onConfirmAction={handleModalConfirm}
      />
    </>
  );
}

export default App;
