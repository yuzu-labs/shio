export type Transcript = {
  videoId: string;
  textSections: TextSection[];
  rawText: string;
};

export type TextSection = {
  start: number;
  duration: number;
  text: string;
};
