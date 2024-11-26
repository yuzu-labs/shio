export type SystemError = {
  relatedAction: string;
  title: string;
  content: string;
};

export enum SystemErrorCode {
  // system errors
  BROWSER_NOT_SUPPORTED,
  CONNECTION_FAILED,
  SYSTEM_OTHER_ERROR,
  SESSION_EXPIRED,

  // login errors
  PASSWORD_UNMATCHED,

  // summarizer errors
  INVALID_URL,
  VIDEO_NOT_FOUND,
  VIDEO_TOO_LONG,
  DIALOGUE_NOT_FOUND,
  LANGUAGE_NOT_SUPPORTED,
  TRANSCRIPTION_ERROR,
  SUMMARIZES_OTHER_ERROR,
}
