/**
 * Family voice messages belong to one word (#137): the list is 100+ words long, so a message shown above the list was
 * off screen for a grown-up who had scrolled down to the word they were recording.
 */
export type VoiceNotice = { wordId: string; text: string; permissionDenied?: boolean };

export const VOICE_NOTICE = {
  permissionDenied: 'Microphone access is off, so words can\'t be recorded. You can turn it on in Settings.',
  startFailed: 'Could not start recording. Please try again.',
  saving: 'Saving…',
  savedDevice: 'Saved on this device.',
  savedWeb: 'Saved for this visit (web preview: recordings are kept until the page reloads).',
  saveFailed: 'Could not save the recording. Please try again.',
  deleteFailed: 'Could not delete the recording. Please try again.',
  recording: (translit: string) => `Recording "${translit}"… say the word, then tap Stop.`,
  deleted: (translit: string) => `Deleted the recording of "${translit}".`,
} as const;

/** The notice to show in this word's row, if it is the word the last message was about. */
export function noticeForWord(notice: VoiceNotice | null, wordId: string): VoiceNotice | null {
  return notice?.wordId === wordId ? notice : null;
}
