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
