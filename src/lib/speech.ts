import * as Speech from 'expo-speech';

const ARMENIAN = 'hy-AM';

/**
 * Speaks Armenian text with the device voice. Many devices have no Armenian voice yet;
 * recorded native-speaker audio should replace this before launch.
 */
export function speakArmenian(text: string): void {
  Speech.stop();
  Speech.speak(text, { language: ARMENIAN, rate: 0.85, pitch: 1.1 });
}

export function speakEnglish(text: string): void {
  Speech.stop();
  Speech.speak(text, { language: 'en-US', rate: 0.95, pitch: 1.1 });
}

export function stopSpeaking(): void {
  Speech.stop();
}
