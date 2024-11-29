export enum SummarizerState {
  INITIAL,
  DIALOGUE_LOADING,
  DIALOGUE_RECEIVED,
  OVERVIEW_LOADING,
  KEYPOINT_LOADING,
  ACTION_ITEMS_LOADING,
  DONE,
}

export enum SystemErrorCode {
  // system errors
  BROWSER_NOT_SUPPORTED,
  CONNECTION_FAILED,
  SYSTEM_OTHER_ERROR,
  SESSION_EXPIRED,

  // login errors
  PASSWORD_UNMATCHED,
  LOGGED_OUT, // TODO: tell jen to remove or adjust this error code

  // summarizer errors
  INVALID_URL,
  VIDEO_NOT_FOUND,
  VIDEO_TOO_LONG,
  DIALOGUE_NOT_FOUND,
  LANGUAGE_NOT_SUPPORTED,
  TRANSCRIPTION_ERROR,
  SUMMARIZES_OTHER_ERROR, // anything happened in summarizer including unknown AI error
}
