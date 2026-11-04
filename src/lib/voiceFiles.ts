import { Directory, File, Paths } from 'expo-file-system';

import { ACTIVE_PACK } from '@/content/packs';

/**
 * Family voice files (AI_DECISIONS 2026-11-04 "Family voice"): one folder per child under the app's documents
 * directory, never shared or uploaded. File names are generated, so a stored name is only ever a plain file name.
 */
const FOLDER = 'voice';

/** Index of a child's recordings in one language: word id → file name. */
export const voiceKey = (childId: string, packId: string = ACTIVE_PACK.id) => `littleroots.voice.v1.${childId}.${packId}`;

export function childVoiceFolder(childId: string): Directory {
  return new Directory(Paths.document, FOLDER, childId);
}

export function voiceFile(childId: string, name: string): File {
  return new File(Paths.document, FOLDER, childId, name);
}

/** A stored name must be a single path component we generated (no folders, no `..`). */
export function isVoiceFileName(name: string): boolean {
  return /^[A-Za-z0-9._%-]+$/.test(name) && name !== '.' && name !== '..';
}

export function newVoiceFileName(packId: string, wordId: string, extension: string, now = Date.now()): string {
  const ext = /^\.[A-Za-z0-9]{1,5}$/.test(extension) ? extension : '.m4a';
  return `${packId}-${encodeURIComponent(wordId).replace(/\./g, '_')}-${now}${ext}`;
}

/** Removes every recording of a child (all languages). Missing folders and platforms without files are fine. */
export function deleteChildVoiceFiles(childId: string): void {
  try {
    const folder = childVoiceFolder(childId);
    if (folder.exists) folder.delete();
  } catch { /* No file system (web) or already gone. */ }
}
