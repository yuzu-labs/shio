import { BearerToken } from './auth';
import { Transcript } from './transcript';

export type AuthAPIResponse = BaseAPIResponse & {
  token: BearerToken;
};

export type TranscriptAPIResponse = BaseAPIResponse & {
  data: Transcript;
};

type BaseAPIResponse = {
  status: boolean;
};

export namespace YoutubeAPIResponse {
  export type Video = BaseAPIResponse & {
    videos: GoogleApiYouTubePaginationInfo<GoogleApiYouTubeVideoResource>;
  };
}
