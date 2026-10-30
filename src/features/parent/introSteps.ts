import { THEMES } from '@/content/themes';
import { FREE_LIMITS, MAX_PROFILES } from '@/lib/entitlements';

export type IntroStep = { id: string; title: string; body: string; emoji?: string };

const freeThemes = THEMES.filter((theme) => theme.free).map((theme) => theme.titleEn).join(' and ');

export const INTRO_STEPS: IntroStep[] = [
  {
    id: 'daily-lesson',
    title: 'A little learning each day',
    body: 'One 5–10 minute lesson starts with hello, then 3 new words, a game, a rhyme, and a chance to say the words aloud. Your child earns a sticker at the end. Buddy the bear guides the lesson and speaks along the way.',
    emoji: '🐻',
  },
  {
    id: 'family-voice',
    title: 'Let your child hear your voice',
    body: 'In Parents → Family voice, record words in your own voice. Your recordings stay on this device.',
    emoji: '🎙️',
  },
  {
    id: 'daily-reminder',
    title: 'Make it a gentle routine',
    body: 'Set a gentle daily reminder for a time that works for your family.',
    emoji: '⏰',
  },
  {
    id: 'plans',
    title: 'Start free, grow when ready',
    body: `Free includes ${freeThemes} themes, a daily lesson, ${FREE_LIMITS.recordings} family voice recordings, ${FREE_LIMITS.tracingLetters} letters to trace, ${FREE_LIMITS.gamesPerDay} games a day, and a weekly summary. Premium includes all ${THEMES.length} themes, the full alphabet, unlimited games and recordings, a full progress report, and up to ${MAX_PROFILES} children.`,
    emoji: '🌱',
  },
];
