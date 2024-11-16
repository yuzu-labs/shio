import { AspectRatio, Box, Typography } from '@mui/joy';
import React from 'react';

type Props = {};

const NavBar = (props: Props) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        p: 3,
      }}>
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
    </Box>
  );
};

export default NavBar;
