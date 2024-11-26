import { AspectRatio, Box, Typography } from '@mui/joy';
import { SxProps } from '@mui/joy/styles/types';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { globalActions } from '../../store/reducers';
import { SummarizerState } from '../../models/enum/global';

type Props = {
  sx?: SxProps;
};

const NavBar = (props: Props) => {
  const dispatch = useDispatch();

  return (
    <Box
      sx={{
        ...props.sx,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        p: 3,
      }}>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 1,
          }}>
          <AspectRatio ratio="1" sx={{ width: 24 }}>
            <img alt="logo" src="https://placehold.co/100x100/32383E/32383E" />
          </AspectRatio>
          <Typography component="h1" sx={{ fontWeight: 'xl' }}>
            Yuzu
          </Typography>
        </Box>
      </Link>
      {/* TEST: navigator between different summarizer states */}
      <Box sx={{ display: 'none', flexDirection: 'row', gap: 2 }}>
        <button onClick={() => dispatch(globalActions.updateSummarizerState(SummarizerState.INITIAL))}>Initial</button>
        <button onClick={() => dispatch(globalActions.updateSummarizerState(SummarizerState.DIALOGUE_LOADING))}>
          Loading
        </button>
        <button
          onClick={() => dispatch(globalActions.updateSummarizerState(SummarizerState.OVERVIEW_ACTION_ITEM_LOADING))}>
          Report
        </button>
      </Box>
    </Box>
  );
};

export default NavBar;
