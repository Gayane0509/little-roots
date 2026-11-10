export const PRIVACY_EFFECTIVE = '2026-11-10';
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
      "Your child's first name and avatar picture, so the app can greet them.",
      'Learning progress: which words were learned, stars, stickers, Buddy’s outfit, traced letters and lesson days.',
      'Settings: sound effects, vibration, Buddy’s language and the daily reminder time, if a grown-up sets one.',
      'Family voice recordings, if a grown-up makes them: short audio files of the app’s words, one per word.',
      'This information is never uploaded, shared or sold.',
      'Share this week, in the Parent area, opens your phone’s share menu with a short text you can read first. Nothing is sent unless you pick an app to send it.',
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
    heading: 'Microphone and family voice',
    paragraphs: [
      'The microphone is used only when a grown-up taps Record in Parent area, Family voice, to record the app’s words in their own voice. The app asks for microphone access there, never in front of your child.',
      'Recordings are saved only on this device and played back in the app. They are never uploaded, shared or analysed. There is no speech recognition, no text-to-speech and no AI voice.',
      'Delete one recording in Family voice, or all of a child’s recordings by deleting the child.',
    ],
  },
  {
    heading: 'How to delete your data',
    paragraphs: [
      'Parent area, Reset progress: resets the active child’s words, stars, stickers and traced letters. The child’s name stays.',
      'Parent area, Children: deleting a child removes their profile, learning progress, traced letters and family voice recordings.',
      'Parent area, Family voice: delete any recording. Reset progress keeps recordings.',
      'Delete the app: removes everything stored on the device.',
    ],
  },
  {
    heading: 'Contact',
    paragraphs: [`Questions? Write to ${PRIVACY_CONTACT}.`, `Effective date: ${PRIVACY_EFFECTIVE}.`],
  },
];
