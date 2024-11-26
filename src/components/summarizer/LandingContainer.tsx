import { Box, Button, FormControl, FormHelperText, Input, Stack, Typography } from '@mui/joy';
import React, { useEffect, useState } from 'react';
import { RootState } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { globalActions } from '../../store/reducers';
import { getYoutubeVideoId, isValidYoutubeVideoID } from '../../utils';

type Props = {};

const LandingContainer = (props: Props) => {
  const [validated, setValidated] = useState(false);
  const [urlValid, setUrlValid] = useState(false);
  const [urlErrorMessage, setUrlErrorMessage] = useState('Please enter a URL.');

  const { loading, error } = useSelector((state: RootState) => state.global);
  const { overview } = useSelector((state: RootState) => state.report);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!error || error.relatedAction !== globalActions.loadSummarize.type) return;

    setUrlValid(false);
    setUrlErrorMessage(error.content);
  }, [error]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    const form = event.currentTarget;

    // prevent default form submit effect
    event.preventDefault();
    event.stopPropagation();

    setValidated(true);

    const fd = new FormData(form);
    const yUrl = fd.get('youtube-url');

    setUrlValid(false);

    if (!yUrl) {
      setUrlErrorMessage('Please enter a URL.');
      return;
    }

    const videoId = getYoutubeVideoId(yUrl.toString());

    if (!videoId || !isValidYoutubeVideoID(videoId)) {
      setUrlErrorMessage('Please enter a valid YouTube URL.');
      return;
    }

    setUrlValid(true);

    dispatch(globalActions.loadSummarize({ videoId }));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '32vh' }}>
      <Stack gap={7} sx={{ width: '50%', maxWidth: '768px' }}>
        <Stack gap={4} sx={{ textAlign: 'center' }}>
          <Typography level="h1">YouTube Video Summarizer</Typography>
          <Typography level="body-md">
            Get YouTube transcript and use AI to summarize YouTube videos in one click for free.
          </Typography>
        </Stack>
        <form onSubmit={handleSubmit}>
          <Stack direction="row" gap={2} sx={{ alignItems: 'flex-start' }}>
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
            <Button loading={loading} variant="soft" type="submit">
              Summarize
            </Button>
          </Stack>
        </form>
        {/* TODO: remove test text area */}
        <Typography level="body-sm" sx={{ textAlign: 'center' }}>
          {overview}
        </Typography>
      </Stack>
    </Box>
  );
};

export default LandingContainer;
