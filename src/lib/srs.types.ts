/** Spaced-repetition state of one word for the child. */
export interface WordProgress {
  wordId: string;
  /** Leitner box, 0 = just learned. Higher box = longer interval. */
  box: number;
  /** Epoch ms when the word is next due for review. */
  dueAt: number;
  seen: number;
  correct: number;
  /** Epoch ms of the first time the word was taught. */
  learnedAt: number;
}

export type WordProgressMap = Record<string, WordProgress>;
