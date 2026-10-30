export const PRIVACY_EFFECTIVE = '2026-10-30';
export const PRIVACY_CONTACT = 'gayane.demirchyan94@gmail.com';

export interface PrivacySection {
  heading: string;
  paragraphs: string[];
}

/** Keep in sync with PRIVACY.md at the repo root. */
export const PRIVACY_SECTIONS: PrivacySection[] = [
  {
    heading: 'The short version',
    paragraphs: [
      'Little Roots collects nothing and sends nothing. Everything the app knows stays on this device.',
    ],
  },
  {
    heading: 'What is stored on this device',
    paragraphs: [
      "Your child's first name, so the app can greet them.",
      'Learning progress: which words were learned, stars, stickers and lesson days.',
      'Optional family voice recordings, only if a parent records them.',
      'This information is never uploaded, shared or sold.',
    ],
  },
  {
    heading: 'What we do not do',
    paragraphs: [
      'No ads. No analytics. No accounts. No tracking.',
      'No third-party SDKs that collect data.',
      'The app does not need an internet connection to teach words.',
    ],
  },
  {
    heading: 'Microphone',
    paragraphs: [
      'The microphone is used only inside the parent area, and only when a parent presses record for a family voice recording. Recordings stay on this device.',
    ],
  },
  {
    heading: 'How to delete your data',
    paragraphs: [
      'Parent area, Reset progress: deletes the name, words, stars and stickers.',
      'Parent area, Family voice: delete any recording.',
      'Delete the app: removes everything stored on the device.',
    ],
  },
  {
    heading: 'Contact',
    paragraphs: [`Questions? Write to ${PRIVACY_CONTACT}.`, `Effective date: ${PRIVACY_EFFECTIVE}.`],
  },
];
