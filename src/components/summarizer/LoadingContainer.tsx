import { Box, LinearProgress, Stack, Typography } from '@mui/joy';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { YuzuFadeInOut } from '../transition';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { SummarizerState } from '../../models/enum/global';

type Props = {};

const LoadingContainer = (props: Props) => {
  const [progress, setProgress] = useState(10);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const { summarizerState } = useSelector((state: RootState) => state.global);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 15;
        if (newProgress > 90) {
          clearInterval(intervalRef.current!);
          return 90;
        }
        return newProgress;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current!);
  }, []);

  useEffect(() => {
    if (summarizerState === SummarizerState.DIALOGUE_RECEIVED) {
      setProgress(100);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  }, [summarizerState]);

  const loadingTextElement = useMemo(() => {
    if (progress < 100) {
      return <Typography level="title-lg">Analyzing Data...</Typography>;
    } else {
      return (
        <Typography level="title-lg" color="success">
          Done!
        </Typography>
      );
    }
  }, [progress]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
      }}>
      <Stack gap={2} sx={{ width: '50%', maxWidth: '500px', textAlign: 'center' }}>
        <Box sx={{ position: 'relative', height: '1.5rem' }}>
          <YuzuFadeInOut nodeKey={progress < 100 ? 1 : 2}>
            <Box sx={{ position: 'absolute', width: '100%' }}>{loadingTextElement}</Box>
          </YuzuFadeInOut>
        </Box>
        <LinearProgress size="lg" determinate value={progress} color={progress >= 100 ? 'success' : 'primary'} />
      </Stack>
    </Box>
  );
};

export default LoadingContainer;
