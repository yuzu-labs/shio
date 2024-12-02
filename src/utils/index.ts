import { SystemErrorCode } from '../models/enum/global';

export const getYoutubeVideoId = (url: string) => {
  const pattern =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/|youtube\.com\/v\/|youtube\.com\/attribution_link\?.*v%3D)([a-zA-Z0-9_-]{11})/;
  const match = url.match(pattern);

  return match ? match[1] : null;
};

export const isValidYoutubeVideoID = (videoId: string) => /^[a-zA-Z0-9_-]{11}$/.test(videoId);

export const getGeneralModalContent = (code: SystemErrorCode) => {
  switch (code) {
    case SystemErrorCode.BROWSER_NOT_SUPPORTED:
      return {
        title: 'Browser Not Supported',
        content:
          "Your browser doesn't support the Chrome Build-in AI. If you're on Chrome, join the Early Preview Program to enable it.",
        confirmAction: 'Join Early Preview Program',
      };

    case SystemErrorCode.VIDEO_TOO_LONG:
      return {
        title: 'Video Too Long',
        content: 'The video is too long. For better results, we suggest a video between 2 to 5 minutes.',
        confirmAction: 'Submit new URL',
      };

    case SystemErrorCode.DIALOGUE_NOT_FOUND:
      return {
        title: 'Unable to Process Video',
        content: 'We couldn’t extract dialogue from this video. Please try another video link.',
        confirmAction: 'Submit new URL',
      };

    case SystemErrorCode.TRANSCRIPTION_ERROR:
      return {
        title: 'Transcription Error',
        content: 'Something went wrong while trying to transcribe the video. Please try again.',
        confirmAction: 'Submit new URL',
      };

    case SystemErrorCode.LANGUAGE_NOT_SUPPORTED:
      return {
        title: 'Unsupported Language',
        content:
          'We couldn’t transcribe this video because the language isn’t supported. We only accept videos in English, Japanese, or Spanish. Please try again with a video link.',
        confirmAction: 'Submit new URL',
      };

    default:
      return {
        title: 'Unknown Error',
        content: 'An unknown error occurred',
        confirmAction: 'Ok',
      };
  }
};

export const getErrorToastContent = (code: SystemErrorCode) => {
  switch (code) {
    case SystemErrorCode.SUMMARIZES_OTHER_ERROR:
      return 'System error. Please refresh the page or try again later.';

    default:
      return 'An error occurred';
  }
};
