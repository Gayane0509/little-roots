import { act, useEffect, type ReactNode } from 'react';
import { beforeEach, afterEach, expect, jest, test } from '@jest/globals';
import { LettersProvider, useTracedLetters } from './letters';
import { ProgressProvider, useProgress } from './progress';
import { LEGACY_LETTERS_KEY, LEGACY_PROGRESS_KEY, PROFILES_KEY, ProfilesProvider, lettersKey, loadProfiles, parseProfiles, progressKey, useProfiles } from './profiles';

jest.mock('react-native', () => ({ View: 'div', Text: 'span', Pressable: 'button', AppState: { addEventListener: () => ({ remove: () => {} }) } }));
jest.mock('@react-native-async-storage/async-storage', () => {
  const store = new Map<string, string>();
  const failed = { key: '', removeKey: '', readKey: '', readCount: 0 };
  return { __esModule: true, store, failed, default: {
    getItem: jest.fn(async (key: string) => { if (failed.readKey === key && failed.readCount-- > 0) throw new Error('read failed'); return store.get(key) ?? null; }),
    setItem: jest.fn(async (key: string, value: string) => { if (failed.key === key) throw new Error('write failed'); store.set(key, value); }),
    removeItem: jest.fn(async (key: string) => { if (failed.removeKey === key) throw new Error('remove failed'); store.delete(key); }),
  } };
});
const storage = jest.requireMock('@react-native-async-storage/async-storage') as { store: Map<string, string>; failed: { key: string; removeKey: string; readKey: string; readCount: number }; default: { setItem: jest.Mock; removeItem: jest.Mock; getItem: jest.Mock } };
let profiles: ReturnType<typeof useProfiles>;
let progress: ReturnType<typeof useProgress>;
let letters: ReturnType<typeof useTracedLetters>;
let root: { render(children: ReactNode): void; unmount(): void } | null = null;
function Probe() {
  const p = useProfiles(); const g = useProgress(); const l = useTracedLetters();
  useEffect(() => { profiles = p; progress = g; letters = l; }, [p, g, l]);
  return null;
}
function Tree() {
  const { activeId } = useProfiles();
  return <ProgressProvider key={activeId ?? 'new'}><LettersProvider><Probe /></LettersProvider></ProgressProvider>;
}
async function mount() {
  const element = document.createElement('div'); document.body.appendChild(element);
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createRoot } = require('react-dom/client') as { createRoot(element: HTMLElement): NonNullable<typeof root> };
  root = createRoot(element);
  await act(async () => { root?.render(<ProfilesProvider><Tree /></ProfilesProvider>); });
}
beforeEach(() => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { JSDOM } = require('jsdom');
  const dom = new JSDOM('<!doctype html><html><body></body></html>');
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true, window: dom.window, document: dom.window.document });
  storage.store.clear(); storage.failed.key = ''; storage.failed.removeKey = ''; storage.failed.readKey = ''; storage.failed.readCount = 0; storage.default.setItem.mockReset(); storage.default.removeItem.mockReset(); storage.default.getItem.mockReset();
  storage.default.removeItem.mockImplementation(async (key: unknown) => { if (storage.failed.removeKey === key) throw new Error('remove failed'); storage.store.delete(String(key)); });
  storage.default.getItem.mockImplementation(async (key: unknown) => { if (storage.failed.readKey === key && storage.failed.readCount-- > 0) throw new Error('read failed'); return storage.store.get(String(key)) ?? null; });
  storage.default.setItem.mockImplementation(async (key: unknown, value: unknown) => { if (storage.failed.key === key) throw new Error('write failed'); storage.store.set(String(key), String(value)); });
});
afterEach(async () => { if (root) await act(async () => root?.unmount()); root = null; document.body.innerHTML = ''; });

test('migrates both records and family premium before removing legacy keys', async () => {
  storage.store.set(LEGACY_PROGRESS_KEY, JSON.stringify({ childName: 'Ani', stars: 8, isPremium: true }));
  storage.store.set(LEGACY_LETTERS_KEY, JSON.stringify(['Ա']));
  const result = await loadProfiles();
  expect(result.profiles[0].name).toBe('Ani');
  expect(result.isPremium).toBe(__DEV__);
  expect(storage.store.get(progressKey(result.activeId!))).toContain('"stars":8');
  expect(JSON.parse(storage.store.get(progressKey(result.activeId!))!)).not.toHaveProperty('isPremium');
  expect(storage.store.get(lettersKey(result.activeId!))).toBe('["Ա"]');
  expect(storage.store.has(LEGACY_PROGRESS_KEY)).toBe(false);
  expect(storage.store.has(LEGACY_LETTERS_KEY)).toBe(false);
});
test.each(['child write', 'profile commit'])('failed %s leaves legacy data for retry', async (where) => {
  storage.store.set(LEGACY_PROGRESS_KEY, JSON.stringify({ childName: 'Ani', stars: 8 }));
  storage.store.set(LEGACY_LETTERS_KEY, '["Ա"]');
  if (where === 'profile commit') storage.failed.key = PROFILES_KEY;
  else storage.failed.key = `${LEGACY_PROGRESS_KEY}.blocked`;
  if (where === 'child write') storage.default.setItem.mockImplementationOnce(async () => { throw new Error('write failed'); });
  await expect(loadProfiles()).rejects.toThrow('write failed');
  expect(storage.store.has(PROFILES_KEY)).toBe(false);
  expect(storage.store.has(LEGACY_PROGRESS_KEY)).toBe(true);
  expect(storage.store.has(LEGACY_LETTERS_KEY)).toBe(true);
  storage.failed.key = '';
  storage.default.setItem.mockImplementation(async (key: unknown, value: unknown) => { storage.store.set(String(key), String(value)); });
  const retried = await loadProfiles();
  expect(retried.profiles).toHaveLength(1);
});
test('switching flushes and isolates progress and traced letters', async () => {
  await mount();
  await act(async () => { await profiles.add('Ani', 'family.child'); });
  const aniId = profiles.activeId!;
  await act(async () => { progress.recordAnswer('family.mom', true); letters.markTraced('Ա'); });
  await act(async () => { await profiles.setPremium(true); await profiles.add('Aram', 'animals.cat'); });
  const aramId = profiles.activeId!;
  expect(storage.store.get(progressKey(aniId))).toContain('family.mom');
  expect(storage.store.get(lettersKey(aniId))).toContain('Ա');
  expect(progress.state.words).toEqual({});
  expect(letters.traced.size).toBe(0);
  expect(progress.state.isPremium).toBe(true);
  await act(async () => { progress.recordAnswer('food.apple', true); letters.markTraced('Բ'); await profiles.switchTo(aniId); });
  expect(storage.store.get(progressKey(aramId))).toContain('food.apple');
  expect(storage.store.get(lettersKey(aramId))).toContain('Բ');
  expect(progress.state.words['family.mom']).toBeDefined();
  expect(progress.state.words['food.apple']).toBeUndefined();
  expect(letters.traced.has('Ա')).toBe(true);
  expect(letters.traced.has('Բ')).toBe(false);
});
test('downgrade keeps child data but locks later profiles and selects the first', async () => {
  await mount();
  await act(async () => { await profiles.add('Ani', 'family.child'); await profiles.setPremium(true); await profiles.add('Aram', 'animals.cat'); });
  const firstId = profiles.profiles[0].id;
  const secondId = profiles.profiles[1].id;
  await act(async () => { progress.recordAnswer('family.mom', true); letters.markTraced('Ա'); });
  await act(async () => { await profiles.setPremium(false); });
  expect(profiles.activeId).toBe(firstId);
  expect(profiles.profiles).toHaveLength(2);
  await act(async () => { await profiles.switchTo(secondId); });
  expect(profiles.activeId).toBe(firstId);
  expect(storage.store.get(progressKey(secondId))).toContain('family.mom');
  expect(storage.store.get(lettersKey(secondId))).toContain('Ա');
  const parsed = parseProfiles(JSON.stringify({ profiles: profiles.profiles, activeId: secondId, isPremium: false }));
  expect(parsed.activeId).toBe(firstId);
});

test('failed progress write keeps the current child active', async () => {
  await mount();
  await act(async () => { await profiles.add('Ani', 'family.child'); });
  const aniId = profiles.activeId!;
  await act(async () => { await profiles.setPremium(true); });
  await act(async () => { await profiles.add('Aram', 'animals.cat'); });
  const aramId = profiles.activeId!;
  await act(async () => { await profiles.switchTo(aniId); });
  storage.failed.key = progressKey(aniId);
  await act(async () => { progress.recordAnswer('family.mom', true); });
  await act(async () => { await expect(profiles.switchTo(aramId)).rejects.toThrow('Progress is not saved'); });
  expect(profiles.activeId).toBe(aniId);
  expect(progress.state.words['family.mom']).toBeDefined();
});

test('corrupt profile record blocks load and does not overwrite data', async () => {
  storage.store.set(PROFILES_KEY, '{broken');
  storage.store.set(LEGACY_PROGRESS_KEY, '{old');
  await expect(loadProfiles()).rejects.toThrow();
  await mount();
  expect(document.body.textContent).toContain('Could not load family data.');
  expect(document.body.textContent).toContain('Try again');
  expect(storage.store.get(PROFILES_KEY)).toBe('{broken');
  expect(storage.store.get(LEGACY_PROGRESS_KEY)).toBe('{old');
  expect(storage.default.setItem).not.toHaveBeenCalled();
});
test('invalid child id blocks load instead of dropping saved data', () => {
  expect(() => parseProfiles(JSON.stringify({ profiles: [{ id: '../bad', name: 'Ani', avatarWordId: 'family.child' }] }))).toThrow('Invalid child profile');
});
test('unknown avatar preserves profile and extra profiles are capped', () => {
  const profiles = Array.from({ length: 5 }, (_, i) => ({ id: `child-${i}`, name: `Child ${i}`, avatarWordId: 'future.avatar' }));
  const parsed = parseProfiles(JSON.stringify({ profiles, activeId: 'child-0', isPremium: false }));
  expect(parsed.profiles).toHaveLength(4);
  expect(parsed.profiles[0].avatarWordId).toBe('family.child');
});
test('corrupt legacy progress is copied raw under deterministic id', async () => {
  storage.store.set(LEGACY_PROGRESS_KEY, '{broken');
  const result = await loadProfiles();
  expect(result.activeId).toBe('child-1');
  expect(result.profiles[0].name).toBe('Friend');
  expect(storage.store.get(progressKey('child-1'))).toBe('{broken');
});
test('retry after profile commit failure reuses child-1; existing profile record cleans stale legacy keys', async () => {
  storage.store.set(LEGACY_PROGRESS_KEY, JSON.stringify({ childName: 'Ani' }));
  storage.failed.key = PROFILES_KEY;
  await expect(loadProfiles()).rejects.toThrow();
  expect(storage.store.has(progressKey('child-1'))).toBe(true);
  storage.failed.key = '';
  const result = await loadProfiles();
  expect(result.activeId).toBe('child-1');
  storage.store.set(LEGACY_PROGRESS_KEY, 'stale');
  storage.store.set(LEGACY_LETTERS_KEY, 'stale');
  await loadProfiles();
  expect(storage.store.has(LEGACY_PROGRESS_KEY)).toBe(false);
  expect(storage.store.has(LEGACY_LETTERS_KEY)).toBe(false);
});
test('free limit rejects another child without changing the active profile', async () => {
  await mount();
  await act(async () => { expect(await profiles.add('Ani', 'family.child')).toBe(true); });
  const activeId = profiles.activeId;
  await act(async () => { expect(await profiles.add('Aram', 'animals.cat', { activate: false })).toBe(false); });
  expect(profiles.profiles).toHaveLength(1);
  expect(profiles.activeId).toBe(activeId);
});
test('parent add keeps active child, deletion removes both keys, and last child is protected', async () => {
  await mount();
  await act(async () => { await profiles.add('Ani', 'family.child'); await profiles.setPremium(true); });
  const aniId = profiles.activeId!;
  await act(async () => { progress.recordAnswer('family.mom', true); letters.markTraced('Ա'); });
  await act(async () => { await profiles.add('Aram', 'animals.cat', { activate: false }); });
  expect(profiles.activeId).toBe(aniId);
  const aramId = profiles.profiles.find((p) => p.name === 'Aram')!.id;
  await act(async () => { await profiles.switchTo(aramId); progress.recordAnswer('food.apple', true); letters.markTraced('Բ'); });
  await act(async () => { await profiles.remove(aramId); });
  expect(profiles.activeId).toBe(aniId);
  expect(storage.store.has(progressKey(aramId))).toBe(false);
  expect(storage.store.has(lettersKey(aramId))).toBe(false);
  await act(async () => { await profiles.remove(aniId); });
  expect(profiles.profiles).toHaveLength(1);
  expect(profiles.activeId).toBe(aniId);
});
test('failed key deletion stays pending and is purged on next load', async () => {
  await mount();
  await act(async () => { await profiles.add('Ani', 'family.child'); await profiles.setPremium(true); await profiles.add('Aram', 'animals.cat', { activate: false }); });
  const aramId = profiles.profiles.find((p) => p.name === 'Aram')!.id;
  storage.store.set(progressKey(aramId), 'stored');
  storage.failed.removeKey = progressKey(aramId);
  await act(async () => { await expect(profiles.remove(aramId)).rejects.toThrow('remove failed'); });
  expect(profiles.pendingDeletes).toContain(aramId);
  expect(storage.store.has(progressKey(aramId))).toBe(true);
  storage.failed.removeKey = '';
  await loadProfiles();
  expect(storage.store.has(progressKey(aramId))).toBe(false);
  expect(parseProfiles(storage.store.get(PROFILES_KEY)!).pendingDeletes).toEqual([]);
});
test('concurrent renames and switches are serialized, and two removes leave one child', async () => {
  await mount();
  await act(async () => { await profiles.add('Ani', 'family.child'); await profiles.setPremium(true); await profiles.add('Aram', 'animals.cat', { activate: false }); await profiles.add('Mane', 'family.sister', { activate: false }); });
  const [aniId, aramId, maneId] = profiles.profiles.map((p) => p.id);
  await act(async () => { await Promise.all([profiles.switchTo(aramId), profiles.rename(aniId, 'Anahit')]); });
  expect(profiles.activeId).toBe(aramId);
  expect(profiles.profiles.find((p) => p.id === aniId)?.name).toBe('Anahit');
  await act(async () => { await Promise.all([profiles.remove(aramId), profiles.remove(maneId)]); });
  expect(profiles.profiles.map((p) => p.id)).toEqual([aniId]);
  expect(profiles.activeId).toBe(aniId);
});
test('failed letters read with no pending marks does not block a switch', async () => {
  storage.store.set(PROFILES_KEY, JSON.stringify({ profiles: [{ id: 'child-1', name: 'Ani', avatarWordId: 'family.child' }, { id: 'child-2', name: 'Aram', avatarWordId: 'animals.cat' }], activeId: 'child-1', isPremium: true }));
  storage.failed.readKey = lettersKey('child-1'); storage.failed.readCount = 2;
  await mount();
  await act(async () => { await profiles.switchTo('child-2'); });
  expect(profiles.activeId).toBe('child-2');
});
test('failed letters read retries pending marks before switching', async () => {
  storage.store.set(PROFILES_KEY, JSON.stringify({ profiles: [{ id: 'child-1', name: 'Ani', avatarWordId: 'family.child' }, { id: 'child-2', name: 'Aram', avatarWordId: 'animals.cat' }], activeId: 'child-1', isPremium: true }));
  storage.failed.readKey = lettersKey('child-1'); storage.failed.readCount = 2;
  await mount();
  await act(async () => { letters.markTraced('Ա'); });
  await act(async () => { await profiles.switchTo('child-2'); });
  expect(storage.store.get(lettersKey('child-1'))).toContain('Ա');
  expect(profiles.activeId).toBe('child-2');
});
