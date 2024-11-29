import { SystemErrorCode } from './enum/global';

export type SystemError = {
  relatedAction: string;
  title: string;
  content: string;
  code: SystemErrorCode;
};
