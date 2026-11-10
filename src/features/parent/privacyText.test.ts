import { expect, test } from '@jest/globals';

import { PRIVACY_EFFECTIVE, PRIVACY_SECTIONS } from './privacyText';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { readFileSync } = require('fs') as { readFileSync(path: string, encoding: 'utf8'): string };
const policy = readFileSync('PRIVACY.md', 'utf8').replace(/\s+/g, ' ');
const stored = PRIVACY_SECTIONS.find((s) => s.heading === 'What is stored on this device')!.paragraphs.join(' ').toLowerCase();
const flat = (text: string) => text.replace(/’/g, "'");

test('the stored-data list names everything the app keeps on the device', () => {
  // profiles (name, avatar), progress (words, stars, stickers, outfit, lesson days), letters, settings, reminder, voice
  for (const item of ['first name', 'avatar', 'words', 'stars', 'stickers', 'outfit', 'traced letters', 'lesson days',
    'sound effects', 'vibration', 'buddy’s language', 'reminder time', 'family voice recordings']) {
    expect(stored).toContain(item);
  }
});

test('PRIVACY.md has the same stored-data lines and effective date as the in-app text', () => {
  for (const p of PRIVACY_SECTIONS.find((s) => s.heading === 'What is stored on this device')!.paragraphs) {
    expect(policy).toContain(flat(p));
  }
  expect(policy).toContain(`Effective date: ${PRIVACY_EFFECTIVE}`);
});
