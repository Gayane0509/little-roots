import { describe, expect, it } from '@jest/globals';
import { initialLessonState, lessonReducer } from './lessonReducer';

describe('lessonReducer', () => {
  it('blocks duplicate answers and advances after feedback once', () => {
    const game = { ...initialLessonState, stepIndex: 2 };
    const correct = lessonReducer(game, { type: 'CORRECT', round: 0, selectedId: 'a' });
    expect(lessonReducer(correct, { type: 'CORRECT', round: 0, selectedId: 'a' })).toBe(correct);
    expect(correct.firstTryCorrect).toBe(1);
    const next = lessonReducer(correct, { type: 'FINISH_FEEDBACK', round: 0, count: 1, steps: 6 });
    expect(next.stepIndex).toBe(3);
    expect(lessonReducer(next, { type: 'FINISH_FEEDBACK', round: 0, count: 1, steps: 6 })).toBe(next);
  });

  it('does not award a first try after a wrong choice', () => {
    const wrong = lessonReducer(initialLessonState, { type: 'WRONG', round: 0 });
    const correct = lessonReducer(wrong, { type: 'CORRECT', round: 0, selectedId: 'a' });
    expect(correct.firstTryCorrect).toBe(0);
    expect(correct.hadWrongTap).toBe(true);
  });

  it('counts wrong taps per round for the visual hint and resets them on the next round', () => {
    const game = { ...initialLessonState, stepIndex: 2 };
    const twice = lessonReducer(lessonReducer(game, { type: 'WRONG', round: 0 }), { type: 'WRONG', round: 0 });
    expect(twice.wrongTaps).toBe(2);
    const correct = lessonReducer(twice, { type: 'CORRECT', round: 0, selectedId: 'a' });
    expect(lessonReducer(correct, { type: 'FINISH_FEEDBACK', round: 0, count: 2, steps: 5 }).wrongTaps).toBe(0);
  });
});
