import { expect, test } from '@jest/globals';
import { DELETE_CHILD_MESSAGE } from './deleteChildText';
import { PRIVACY_SECTIONS } from './privacyText';

test('the delete-child warning names everything the privacy text says deleting a child removes', () => {
  const privacyLine = PRIVACY_SECTIONS.flatMap((s) => s.paragraphs).find((p) => p.startsWith('Parent area, Children:'));
  expect(privacyLine).toMatch(/family voice recordings/i);
  for (const item of ['learning progress', 'traced letters', 'family voice recordings']) {
    expect(DELETE_CHILD_MESSAGE.toLowerCase()).toContain(item);
  }
  expect(DELETE_CHILD_MESSAGE).toContain('cannot be undone');
});
