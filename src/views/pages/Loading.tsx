import React from 'react';
import { Box, CircularProgress } from '@mui/joy';

type Props = {};

const Loading = (props: Props) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%',
        pt: '32vh',
      }}>
      <CircularProgress />
    </Box>
  );
};

export default Loading;
