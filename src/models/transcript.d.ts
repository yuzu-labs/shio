export type Transcript = {
  videoId: string;
  textSections: TextSection[];
};

export type TextSection = {
  start: number;
  duration: number;
  text: string;
};
