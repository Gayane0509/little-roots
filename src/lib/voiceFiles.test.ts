import { expect, test } from '@jest/globals';

import * as FileSystem from 'expo-file-system';

import { deleteChildVoiceFiles, isVoiceFileName, newVoiceFileName, voiceFile } from './voiceFiles';

// The root manual mock (`__mocks__/expo-file-system.ts`); the same instance the module under test uses.
const fs = FileSystem as unknown as { files: Set<string> };

test('generated names are single safe path components', () => {
  const name = newVoiceFileName('hy', 'family.mom', '.m4a', 1);
  expect(name).toBe('hy-family_mom-1.m4a');
  expect(isVoiceFileName(name)).toBe(true);
  expect(newVoiceFileName('hy', 'family.mom', '/../x', 1)).toBe('hy-family_mom-1.m4a');
  expect(isVoiceFileName('../a.m4a')).toBe(false);
  expect(isVoiceFileName('a/b.m4a')).toBe(false);
  expect(isVoiceFileName('..')).toBe(false);
});
test('deleting a child removes every recording of that child, and only that child', () => {
  fs.files.add(voiceFile('child-1', 'hy-a-1.m4a').uri);
  fs.files.add(voiceFile('child-1', 'hy-b-1.m4a').uri);
  fs.files.add(voiceFile('child-2', 'hy-a-1.m4a').uri);
  deleteChildVoiceFiles('child-1');
  expect([...fs.files]).toEqual([voiceFile('child-2', 'hy-a-1.m4a').uri]);
  expect(() => deleteChildVoiceFiles('nobody')).not.toThrow();
});
