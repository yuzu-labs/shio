import { Box, Stack } from '@mui/joy';
import React from 'react';
// import { useSelector } from 'react-redux';
// import { RootState } from '../../store';
// import { SummarizerState } from '../../models/enum/global';
import { YoutubeEmbed } from './report';

type Props = {};

const ReportContainer = (props: Props) => {
  // const { summarizerState } = useSelector((state: RootState) => state.global);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '32vh',
      }}>
      <Stack gap={2} sx={{ width: '50%', maxWidth: '768px', textAlign: 'center' }}>
        <YoutubeEmbed />
      </Stack>
    </Box>
  );
};

export default ReportContainer;
