import { expect, test } from '@jest/globals';

import { spokenLabel } from './spokenLabel';

test('drops decorative emoji and pictographs from spoken labels', () => {
  expect(spokenLabel('📤 Share with family')).toBe('Share with family');
  expect(spokenLabel('⚙️ Sound & Buddy language')).toBe('Sound & Buddy language');
  expect(spokenLabel('▶ Start a lesson')).toBe('Start a lesson');
  expect(spokenLabel('🔒 Privacy')).toBe('Privacy');
  expect(spokenLabel('Great job 👩‍🦱!')).toBe('Great job !');
});

test('keeps plain, Armenian and number labels unchanged', () => {
  expect(spokenLabel("Start today's lesson")).toBe("Start today's lesson");
  expect(spokenLabel('Բարև, Mari')).toBe('Բարև, Mari');
  expect(spokenLabel('Ask a grown-up for 80 more words')).toBe('Ask a grown-up for 80 more words');
});

test('an emoji-only label is kept rather than emptied', () => {
  expect(spokenLabel('🍎')).toBe('🍎');
});
