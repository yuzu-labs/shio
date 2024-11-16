import { Box, Button, Input, Stack, Typography } from '@mui/joy';
import React from 'react';

type Props = {};

const Auth = (props: Props) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
      }}>
      <Stack gap={7} sx={{ width: '50%', maxWidth: '768px' }}>
        <Stack spacing={4} sx={{ textAlign: 'center' }}>
          <Typography level="h1">Welcome</Typography>
          <Typography level="body-sm">Enter the password provided from the development team.</Typography>
        </Stack>
        <form>
          <Stack direction="row" spacing={2} sx={{ flexGrow: '1' }}>
            <Input placeholder="Type in here…" variant="outlined" sx={{ flexGrow: 1 }} />
            <Button type="submit">Submit</Button>
          </Stack>
        </form>
      </Stack>
    </Box>
  );
};

export default Auth;
