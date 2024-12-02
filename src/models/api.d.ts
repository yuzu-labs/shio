import { BearerToken } from './auth';

export type AuthAPIResponse = BaseAPIResponse & {
  token: BearerToken;
};

export type TranscriptAPIResponse = BaseAPIResponse & {
  data: {
    videoId: string;
    textSections: TextSection[];
  };
};

type BaseAPIResponse = {
  status: boolean;
  message?: string;
};

export namespace YoutubeAPIResponse {
  export type Video = BaseAPIResponse & {
    videos: GoogleApiYouTubePaginationInfo<GoogleApiYouTubeVideoResource>;
  };
}
