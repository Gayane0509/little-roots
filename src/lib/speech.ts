import * as Speech from 'expo-speech';
import { useEffect, useState } from 'react';

import { ACTIVE_PACK } from '@/content/packs';

const { locale: FAMILY_LOCALE, voicePrefix: FAMILY_VOICE } = ACTIVE_PACK.speech;

/**
 * Speaks Armenian text with the device voice. Many devices have no Armenian voice yet;
 * recorded native-speaker audio should replace this before launch.
 */
export function speakArmenian(text: string): void {
  Speech.stop();
  Speech.speak(text, { language: FAMILY_LOCALE, rate: 0.85, pitch: 1.1 });
}

export function speakEnglish(text: string): void {
  Speech.stop();
  Speech.speak(text, { language: 'en-US', rate: 0.95, pitch: 1.1 });
}

export function stopSpeaking(): void {
  Speech.stop();
}

export function useArmenianVoiceAvailable(): boolean | null {
  const [available, setAvailable] = useState<boolean | null>(null);
  useEffect(() => {
    let active = true;
    Speech.getAvailableVoicesAsync()
      .then((voices) => { if (active) setAvailable(voices.some((voice) => voice.language.toLowerCase().startsWith(FAMILY_VOICE))); })
      .catch(() => { if (active) setAvailable(false); });
    return () => { active = false; };
  }, []);
  return available;
}
