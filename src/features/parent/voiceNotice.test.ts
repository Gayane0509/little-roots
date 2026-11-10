import { describe, expect, it } from '@jest/globals';
import { noticeForWord, VOICE_NOTICE, type VoiceNotice } from './voiceNotice';

describe('noticeForWord', () => {
  const notice: VoiceNotice = { wordId: 'tatik', text: VOICE_NOTICE.permissionDenied, permissionDenied: true };

  it('shows the message only in the row of the word it is about', () => {
    expect(noticeForWord(notice, 'tatik')).toBe(notice);
    expect(noticeForWord(notice, 'mayrik')).toBeNull();
  });

  it('shows nothing when there is no message', () => {
    expect(noticeForWord(null, 'tatik')).toBeNull();
  });

  it('names the word in recording and delete messages', () => {
    expect(VOICE_NOTICE.recording('tatik')).toContain('"tatik"');
    expect(VOICE_NOTICE.deleted('tatik')).toContain('"tatik"');
  });
});
