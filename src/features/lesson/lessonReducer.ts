export type Step = 'hello' | 'new' | 'game' | 'song' | 'speak' | 'reward';

export interface LessonState {
  stepIndex: number;
  cardIndex: number;
  roundIndex: number;
  speakIndex: number;
  songLineIndex: number | null;
  firstTryCorrect: number;
  hadWrongTap: boolean;
  selectedId: string | null;
  feedbackPending: boolean;
}

export const initialLessonState: LessonState = {
  stepIndex: 0, cardIndex: 0, roundIndex: 0, speakIndex: 0,
  songLineIndex: null, firstTryCorrect: 0, hadWrongTap: false,
  selectedId: null, feedbackPending: false,
};

export type LessonAction =
  | { type: 'NEXT_STEP'; steps: number; expected: number }
  | { type: 'NEXT_CARD'; count: number; expected: number; expectedStep: number; steps: number }
  | { type: 'NEXT_SPEAK'; count: number; expected: number; expectedStep: number; steps: number }
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
    case 'NEXT_SPEAK':
      if (state.speakIndex !== action.expected || state.stepIndex !== action.expectedStep || state.feedbackPending) return state;
      return state.speakIndex + 1 < action.count ? { ...state, speakIndex: state.speakIndex + 1 } :
        { ...state, stepIndex: Math.min(state.stepIndex + 1, action.steps - 1) };
    case 'SONG_LINE': return { ...state, songLineIndex: action.index };
    case 'WRONG':
      return state.roundIndex !== action.round || state.feedbackPending ? state :
        { ...state, hadWrongTap: true };
    case 'CORRECT':
      return state.roundIndex !== action.round || state.feedbackPending ? state :
        { ...state, selectedId: action.selectedId, feedbackPending: true,
          firstTryCorrect: state.firstTryCorrect + (state.hadWrongTap ? 0 : 1) };
    case 'FINISH_FEEDBACK':
      if (state.roundIndex !== action.round || !state.feedbackPending) return state;
      return { ...state, roundIndex: Math.min(state.roundIndex + 1, action.count),
        stepIndex: state.roundIndex + 1 >= action.count ? Math.min(state.stepIndex + 1, action.steps - 1) : state.stepIndex,
        hadWrongTap: false, selectedId: null, feedbackPending: false };
  }
}
