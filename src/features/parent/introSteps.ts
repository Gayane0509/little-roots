import { ACTIVE_PACK } from '@/content/packs';
import { FREE_LIMITS, MAX_PROFILES } from '@/lib/entitlements';

export type IntroStep = { id: string; title: string; body: string; emoji?: string };

const freeThemes = ACTIVE_PACK.themes.filter((theme) => theme.free).map((theme) => theme.titleEn).join(' and ');

export const INTRO_STEPS: IntroStep[] = [
  {
    id: 'daily-lesson',
    title: 'A little learning each day',
    body: 'One 5–10 minute lesson starts with hello, then 3 new words with pictures, a game, and a short rhyme to read together. Your child earns a sticker at the end. Buddy the bear guides the lesson with short messages.',
    emoji: '🐻',
  },
  {
    id: 'read-together',
    title: 'Read it together',
    body: 'Each word comes with a picture, its Armenian spelling and a transliteration. Sit with your child, read the word and point at the picture. The weekly report lists words to practise at home.',
    emoji: '📖',
  },
  {
    id: 'family-voice',
    title: 'Your voice, their words',
    body: 'In Parent area, Family voice, record the words one by one in your own voice. Your child then hears you on word cards, in lessons and in Find the picture. Recordings stay on this device and are never uploaded.',
    emoji: '💛',
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
    body: `Free includes ${freeThemes} themes, a daily lesson, ${FREE_LIMITS.tracingLetters} letters to trace, ${FREE_LIMITS.gamesPerDay} games a day, and a weekly summary. Premium includes all ${ACTIVE_PACK.themes.length} themes, the full alphabet, unlimited games, a full progress report, and up to ${MAX_PROFILES} children.`,
    emoji: '🌱',
  },
];
