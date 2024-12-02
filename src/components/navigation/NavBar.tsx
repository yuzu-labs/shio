import { AspectRatio, Box, Typography } from '@mui/joy';
import { SxProps } from '@mui/joy/styles/types';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../../store';
import { SummarizerState } from '../../models/enum/global';
import { globalActions } from '../../store/reducers';

type Props = {
  sx?: SxProps;
};

const NavBar = (props: Props) => {
  const { summarizerState } = useSelector((state: RootState) => state.global);
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
      <Link
        to="/"
        style={{ textDecoration: 'none' }}
        onClick={() => {
          if (summarizerState !== SummarizerState.INITIAL) {
            dispatch(globalActions.clearSummarizer());
          }
        }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 1,
          }}>
          <AspectRatio ratio="1" sx={{ width: 24 }}>
            <svg width="23" height="24" viewBox="0 0 23 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12.6162 3.41499C12.6162 2.26293 14.0173 1.69513 14.8193 2.52214L22.2096 10.1424C22.6963 10.6443 22.9685 11.316 22.9685 12.0151V20.8355C22.9685 21.9876 21.5675 22.5554 20.7654 21.7284L13.3751 14.108C12.8884 13.6062 12.6162 12.9345 12.6162 12.2354V3.41499Z"
                fill="#636B74"
              />
              <path
                d="M6.20117 3.1645C6.20117 2.01245 7.60222 1.44465 8.40426 2.27165L15.6855 9.7795C16.2422 10.3535 16.5535 11.1217 16.5535 11.9212V20.585C16.5535 21.7371 15.1524 22.3049 14.3504 21.4779L6.96008 13.8576C6.47337 13.3557 6.20117 12.684 6.20117 11.9849V3.1645Z"
                fill="#32383E"
              />
              <path
                d="M0 3.41499C0 2.26293 1.40104 1.69513 2.20309 2.52214L9.5934 10.1424C10.0801 10.6443 10.3523 11.316 10.3523 12.0151V20.8355C10.3523 21.9876 8.95126 22.5554 8.14922 21.7284L0.758912 14.108C0.272196 13.6062 0 12.9345 0 12.2354V3.41499Z"
                fill="#171A1C"
              />
            </svg>
          </AspectRatio>
          <Typography component="h1" sx={{ fontWeight: 'xl' }}>
            Shio AI
          </Typography>
        </Box>
      </Link>
    </Box>
  );
};

export default NavBar;
