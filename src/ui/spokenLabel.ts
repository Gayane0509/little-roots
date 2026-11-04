/**
 * The words a screen reader should say for a visible label: decorative emoji and pictographs ("📤 Share", "▶ Start")
 * are dropped so VoiceOver/TalkBack don't read "outbox tray" or "play button" first (#70). Text is kept as is.
 */
export function spokenLabel(label: string): string {
  const spoken = label.replace(/[\p{Extended_Pictographic}\u{FE0F}\u{200D}\u{20E3}\u{1F3FB}-\u{1F3FF}]/gu, '').replace(/\s+/g, ' ').trim();
  return spoken || label;
}
