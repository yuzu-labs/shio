import { Box, LinearProgress, Stack, Typography } from '@mui/joy';
import React, { useEffect, useMemo, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

type Props = {};

const LoadingContainer = (props: Props) => {
  const [progress, setProgress] = useState(20);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 60;
        if (newProgress > 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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
          <TransitionGroup component={null}>
            <CSSTransition key={progress < 100 ? 1 : 2} timeout={500} classNames="fade" unmountOnExit mountOnEnter>
              <Box sx={{ position: 'absolute', width: '100%' }}>{loadingTextElement}</Box>
            </CSSTransition>
          </TransitionGroup>
        </Box>
        <LinearProgress size="lg" determinate value={progress} color={progress >= 100 ? 'success' : 'primary'} />
      </Stack>
    </Box>
  );
};

export default LoadingContainer;
