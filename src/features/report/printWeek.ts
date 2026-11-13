import { Asset } from 'expo-asset';
import { File } from 'expo-file-system';
import * as Print from 'expo-print';
import { Platform } from 'react-native';

import { getWordArt } from '@/art';
import { WORD_PICTURES } from '@/art/pictures';
import '@/art/words';
import type { Word } from '@/content/types';

import { type PrintPicture, weeklyPrintHtml } from './printSheet';

async function printPicture(word: Word): Promise<PrintPicture> {
  const source = WORD_PICTURES[word.id];
  if (source !== undefined) {
    try {
      // The web print frame shares the app's origin, so the bundled URL loads; the native print renderer gets the bytes inline.
      if (Platform.OS === 'web') {
        const uri = typeof source === 'number' ? Asset.fromModule(source).uri : 'uri' in source ? source.uri : undefined;
        if (uri) return { kind: 'img', src: new URL(uri, window.location.href).href };
      } else if (typeof source === 'number') {
        const asset = await Asset.fromModule(source).downloadAsync();
        if (asset.localUri) return { kind: 'img', src: `data:image/png;base64,${await new File(asset.localUri).base64()}` };
      }
    } catch {
      // Fall through to the drawing or emoji: a missing picture must not stop the sheet.
    }
  }
  const xml = getWordArt(word.id);
  return xml ? { kind: 'svg', xml } : { kind: 'emoji', text: word.emoji };
}

/** expo-print on web prints the whole app page, so the sheet goes through a hidden same-origin frame instead. */
function printOnWeb(html: string): Promise<void> {
  return new Promise((resolve) => {
    const frame = document.createElement('iframe');
    frame.setAttribute('aria-hidden', 'true');
    frame.style.cssText = 'position:fixed;width:0;height:0;border:0;opacity:0';
    frame.onload = () => {
      const win = frame.contentWindow;
      const done = () => { frame.remove(); resolve(); };
      if (!win) return done();
      win.addEventListener('afterprint', done, { once: true });
      // Pictures load before printing; print() blocks in most browsers, the timeout covers those where it doesn't fire afterprint.
      win.focus();
      win.print();
      setTimeout(done, 60_000);
    };
    frame.srcdoc = html;
    document.body.appendChild(frame);
  });
}

/** Opens the system print sheet (print or save as PDF) with these words as picture cards. Offline only. */
export async function printWeekWords(childName: string, words: Word[]): Promise<void> {
  const cards = await Promise.all(words.map(async (word) => ({ hy: word.hy, translit: word.translit, en: word.en, picture: await printPicture(word) })));
  const html = weeklyPrintHtml({ childName, words: cards });
  if (Platform.OS === 'web') return printOnWeb(html);
  await Print.printAsync({ html });
}
