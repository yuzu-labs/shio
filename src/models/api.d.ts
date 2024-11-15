import { BearerToken } from './auth';

export type AuthAPIResponse = BaseAPIResponse & {
  token: BearerToken;
};

type BaseAPIResponse = {
  status: boolean;
};
