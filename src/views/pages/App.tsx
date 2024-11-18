import { Box, Button, FormControl, FormHelperText, Input, Stack, Typography } from '@mui/joy';
import React, { useState } from 'react';
// import { globalActions } from '../../store/reducers';
// import { useDispatch } from 'react-redux';

function App() {
  const [validated, setValidated] = useState(false);
  const [urlValid, setUrlValid] = useState(false);
  const [urlErrorMessage, setUrlErrorMessage] = useState('The URL is invalid.');

  // const dispatch = useDispatch();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    const form = event.currentTarget;

    // prevent default form submit effect
    event.preventDefault();
    event.stopPropagation();

    setValidated(true);

    const fd = new FormData(form);
    const yUrl = fd.get('youtube-url');

    if (!yUrl) {
      setUrlValid(false);
      setUrlErrorMessage('The URL is invalid.');
      return;
    }

    setUrlValid(true);

    // dispatch(globalActions.login({ loginPlainText: yUrl.toString() }));
    console.log(`Summarize the video: ${yUrl.toString()}`);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%',
        pt: '32vh',
      }}>
      <Stack gap={7} sx={{ width: '50%', maxWidth: '768px' }}>
        <Stack spacing={4} sx={{ textAlign: 'center' }}>
          <Typography level="h1">YouTube Video Summarizer</Typography>
          <Typography level="body-md">
            Get YouTube transcript and use AI to summarize YouTube videos in one click for free.
          </Typography>
        </Stack>
        <form onSubmit={handleSubmit}>
          <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start' }}>
            <FormControl error={validated && !urlValid} sx={{ flexGrow: 1 }}>
              <Input
                name="youtube-url"
                placeholder="Enter a YouTube video URL and press “Summarize”"
                variant="outlined"
                type="url"
              />
              {validated && !urlValid && (
                <FormHelperText sx={{ position: 'absolute', top: '36px' }}>{urlErrorMessage}</FormHelperText>
              )}
            </FormControl>
            <Button variant="soft" type="submit">
              Summarize
            </Button>
          </Stack>
        </form>
      </Stack>
    </Box>
  );
}

export default App;
