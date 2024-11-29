import { Box, Button, IconButton, List, ListItem, Skeleton, Stack, Tooltip, Typography } from '@mui/joy';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
// import { SummarizerState } from '../../models/enum/global';
import { YoutubeEmbed } from './report';
import { Check, ContentCopy, OpenInNew } from '@mui/icons-material';

type Props = {};

const ReportContainer = (props: Props) => {
  const SKELETON_ANIMATION: 'pulse' | 'wave' | false = 'wave';

  const [overviewCopied, setOverviewCopied] = useState(false);
  const [keypointCopied, setKeypointCopied] = useState(false);
  const [actionItemCopied, setActionItemCopied] = useState(false);

  // const { summarizerState } = useSelector((state: RootState) => state.global);
  const { overview, keyPoints, actionItems } = useSelector((state: RootState) => state.report);

  const overviewLoading = overview === undefined;
  const keypointLoading = keyPoints === undefined;
  const actionItemLoading = actionItems === undefined;

  const handleCopy = (paragraph: 'overview' | 'keypoint' | 'actionItem') => {
    switch (paragraph) {
      case 'overview':
        navigator.clipboard.writeText(overview ?? '');
        setOverviewCopied(true);

        // wait for 3 seconds before resetting the copied state
        setTimeout(() => {
          setOverviewCopied(false);
        }, 3000);
        break;
      case 'keypoint':
        navigator.clipboard.writeText('keypoint');
        setKeypointCopied(true);

        // wait for 3 seconds before resetting the copied state
        setTimeout(() => {
          setKeypointCopied(false);
        }, 3000);
        break;

      case 'actionItem':
        navigator.clipboard.writeText('actionItem');
        setActionItemCopied(true);

        // wait for 3 seconds before resetting the copied state
        setTimeout(() => {
          setActionItemCopied(false);
        }, 3000);
        break;
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '32vh',
        paddingBottom: '32vh',
      }}>
      <Stack gap={7} sx={{ width: '50%', maxWidth: '768px' }}>
        <YoutubeEmbed />
        <Stack gap={2}>
          <Typography level="h4">
            <Skeleton animation={SKELETON_ANIMATION} loading={overviewLoading}>
              Overview
            </Skeleton>
          </Typography>
          <Typography level="body-md">
            <Skeleton animation={SKELETON_ANIMATION} loading={overviewLoading}>
              {overview ??
                `
            The video provides an update on SpaceX's preparations for the upcoming sixth flight of the Starship,
            highlighting the improvement in transparency around the launch process, repairs to launch infrastructure
            following previous flights, and ongoing work on the heat shield technology. It discusses the current status
            of the flight schedule, details the progress at the launch sites, and reveals plans for future Starship
            missions while also touching on communication challenges faced by the Fish and Wildlife Service regarding
            spaceflight.
            `}
            </Skeleton>
          </Typography>
          <Box sx={{ display: overviewLoading ? 'none' : undefined }}>
            <Tooltip title="Copy" placement="right" arrow>
              <IconButton
                color={overviewCopied ? 'success' : 'neutral'}
                onClick={() => handleCopy('overview')}
                variant="soft">
                {overviewCopied ? <Check /> : <ContentCopy />}
              </IconButton>
            </Tooltip>
          </Box>
        </Stack>
        <Stack gap={2}>
          <Typography level="h4">
            <Skeleton animation={SKELETON_ANIMATION} loading={keypointLoading}>
              Keypoint
            </Skeleton>
          </Typography>
          <Stack direction={'row'}></Stack>
          {keypointLoading && (
            <Stack gap={1}>
              {[...Array(3)].map((_, index) => (
                <Box key={index} sx={{ paddingInlineStart: '3ch' }}>
                  <Stack
                    spacing={1}
                    sx={{
                      paddingInlineStart: '.25rem',
                      paddingInlineEnd: '.25rem',
                      paddingBlockStart: '.25rem',
                      paddingBlockEnd: '.25rem',
                    }}>
                    <Skeleton animation={SKELETON_ANIMATION} variant="text" width={1} />
                    <Skeleton animation={SKELETON_ANIMATION} variant="text" width={1} />
                    <Skeleton animation={SKELETON_ANIMATION} variant="text" width={0.65} />
                  </Stack>
                </Box>
              ))}
            </Stack>
          )}
          {!keypointLoading && (
            <List marker="disc">
              {keyPoints.map((point, idx) => (
                <ListItem key={idx}>{point}</ListItem>
              ))}
            </List>
          )}
          <Box sx={{ display: keypointLoading ? 'none' : undefined }}>
            <Tooltip title="Copy" placement="right" arrow>
              <IconButton
                color={keypointCopied ? 'success' : 'neutral'}
                onClick={() => handleCopy('keypoint')}
                variant="soft">
                {keypointCopied ? <Check /> : <ContentCopy />}
              </IconButton>
            </Tooltip>
          </Box>
        </Stack>
        <Stack gap={2}>
          <Typography level="h4">
            <Skeleton animation={SKELETON_ANIMATION} loading={actionItemLoading}>
              Action Items
            </Skeleton>
          </Typography>
          {actionItemLoading && (
            <Stack gap={1}>
              {[...Array(3)].map((_, index) => (
                <Box key={index} sx={{ paddingInlineStart: '3ch' }}>
                  <Stack
                    spacing={1}
                    sx={{
                      paddingInlineStart: '.25rem',
                      paddingInlineEnd: '.25rem',
                      paddingBlockStart: '.25rem',
                      paddingBlockEnd: '.25rem',
                    }}>
                    <Skeleton animation={SKELETON_ANIMATION} variant="text" width={1} />
                    <Skeleton animation={SKELETON_ANIMATION} variant="text" width={1} />
                    <Skeleton animation={SKELETON_ANIMATION} variant="text" width={0.65} />
                  </Stack>
                </Box>
              ))}
            </Stack>
          )}
          {!actionItemLoading && (
            <List marker="disc">
              {actionItems.map((item, idx) => (
                <ListItem key={idx}>{item}</ListItem>
              ))}
            </List>
          )}
          <Box sx={{ display: actionItemLoading ? 'none' : undefined }}>
            <Tooltip title="Copy" placement="right" arrow>
              <IconButton
                color={actionItemCopied ? 'success' : 'neutral'}
                onClick={() => handleCopy('actionItem')}
                variant="soft">
                {actionItemCopied ? <Check /> : <ContentCopy />}
              </IconButton>
            </Tooltip>
          </Box>
        </Stack>
        <Box sx={{ bgcolor: 'neutral.100', borderRadius: 'var(--joy-radius-md)', padding: 2, margin: -2 }}>
          <Stack gap={2}>
            <Typography level="title-sm">Related Topics</Typography>
            <Stack gap={2} sx={{ alignItems: 'flex-start' }}>
              {[
                'What are the key improvements in the heat shield technology for Starship?',
                'How does the launch pad repair process impact future missions?',
                "What are the future plans for SpaceX's Starship missions beyond the sixth flight?",
                'Can you explain the communication challenges faced by the Fish and Wildlife Service regarding SpaceX?',
                'What milestones has SpaceX achieved in space exploration recently?',
              ].map((text, idx) => (
                <Button
                  key={idx}
                  component="a"
                  href="#as-link"
                  variant="soft"
                  color="neutral"
                  sx={{ bgcolor: 'background.body' }}
                  endDecorator={<OpenInNew />}>
                  {text}
                </Button>
              ))}
            </Stack>
          </Stack>
        </Box>
        <Stack sx={{ alignItems: 'center' }}>
          <Button variant="soft">New Summary</Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default ReportContainer;
