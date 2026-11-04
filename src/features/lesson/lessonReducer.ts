export type Step = 'hello' | 'new' | 'game' | 'song' | 'reward';

export interface LessonState {
  stepIndex: number;
  cardIndex: number;
  roundIndex: number;
  songLineIndex: number | null;
  firstTryCorrect: number;
  hadWrongTap: boolean;
  /** Wrong taps in the current round; drives the visual hint. */
  wrongTaps: number;
  selectedId: string | null;
  feedbackPending: boolean;
}

export const initialLessonState: LessonState = {
  stepIndex: 0, cardIndex: 0, roundIndex: 0,
  songLineIndex: null, firstTryCorrect: 0, hadWrongTap: false, wrongTaps: 0,
  selectedId: null, feedbackPending: false,
};

export type LessonAction =
  | { type: 'NEXT_STEP'; steps: number; expected: number }
  | { type: 'NEXT_CARD'; count: number; expected: number; expectedStep: number; steps: number }
  | { type: 'SONG_LINE'; index: number }
  | { type: 'WRONG'; round: number }
  | { type: 'CORRECT'; round: number; selectedId: string }
  | { type: 'FINISH_FEEDBACK'; round: number; count: number; steps: number };

export function lessonReducer(state: LessonState, action: LessonAction): LessonState {
  switch (action.type) {
    case 'NEXT_STEP':
      return state.stepIndex !== action.expected || state.feedbackPending ? state :
        { ...state, stepIndex: Math.min(state.stepIndex + 1, action.steps - 1) };
    case 'NEXT_CARD':
      if (state.cardIndex !== action.expected || state.stepIndex !== action.expectedStep || state.feedbackPending) return state;
      return state.cardIndex + 1 < action.count ? { ...state, cardIndex: state.cardIndex + 1 } :
        { ...state, stepIndex: Math.min(state.stepIndex + 1, action.steps - 1) };
    case 'SONG_LINE': return { ...state, songLineIndex: action.index };
    case 'WRONG':
      return state.roundIndex !== action.round || state.feedbackPending ? state :
        { ...state, hadWrongTap: true, wrongTaps: state.wrongTaps + 1 };
    case 'CORRECT':
      return state.roundIndex !== action.round || state.feedbackPending ? state :
        { ...state, selectedId: action.selectedId, feedbackPending: true,
          firstTryCorrect: state.firstTryCorrect + (state.hadWrongTap ? 0 : 1) };
    case 'FINISH_FEEDBACK':
      if (state.roundIndex !== action.round || !state.feedbackPending) return state;
      return { ...state, roundIndex: Math.min(state.roundIndex + 1, action.count),
        stepIndex: state.roundIndex + 1 >= action.count ? Math.min(state.stepIndex + 1, action.steps - 1) : state.stepIndex,
        hadWrongTap: false, wrongTaps: 0, selectedId: null, feedbackPending: false };
  }
}
