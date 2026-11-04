import { RecordingPresets, requestRecordingPermissionsAsync, setAudioModeAsync, useAudioRecorder } from 'expo-audio';
import { router } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Linking, Platform, Pressable, ScrollView, SectionList, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { ACTIVE_PACK } from '@/content/packs';
import { themeArtWordId } from '@/content/themeArt';
import type { ThemeId, Word } from '@/content/types';
import { useParentGuard } from '@/features/parent/gate';
import { RECORDING_AUDIO_MODE, restorePlaybackAudioMode } from '@/lib/audioSession';
import { chunk } from '@/lib/chunk';
import { useFamilyVoice } from '@/state/familyVoice';
import { useProfiles } from '@/state/profiles';
import { BigButton } from '@/ui/BigButton';
import { Screen } from '@/ui/Screen';
import { selectedA11y } from '@/ui/selectedA11y';
import { WordArt } from '@/ui/WordArt';
import { colors, DISPLAY_MAX_FONT_SCALE, font, radius, spacing, TOUCH_MIN, WIDE_BREAKPOINT } from '@/ui/tokens';

/** Words are short; a forgotten Stop never leaves the microphone open. */
const MAX_RECORDING_MS = 5000;

type Filter = 'all' | ThemeId;

/**
 * Family voice recording (AI_DECISIONS 2026-11-04): a grown-up records the app's words one by one, behind the parent
 * gate. The microphone permission is asked here only, on the first Record tap, never in front of the child.
 */
export default function FamilyVoiceScreen() {
  const guard = useParentGuard('/parent/voice');
  const { active } = useProfiles();
  const voice = useFamilyVoice();
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [filter, setFilter] = useState<Filter>('all');
  const [recordingId, setRecordingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [permissionDenied, setPermissionDenied] = useState(false);
  const recordingRef = useRef<string | null>(null);
  const autoStop = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stopRef = useRef<() => Promise<void>>(async () => {});

  const allWords = useMemo(() => ACTIVE_PACK.themes.flatMap((theme) => theme.words), []);
  const recordedCount = allWords.filter((word) => voice.uris[word.id]).length;
  // Tablets show two words a row so the 100+ word list is half as long.
  const columns = useWindowDimensions().width >= WIDE_BREAKPOINT ? 2 : 1;
  const sections = useMemo(() => ACTIVE_PACK.themes
    .filter((theme) => filter === 'all' || theme.id === filter)
    .map((theme) => ({ key: theme.id, title: theme.titleEn, data: chunk(theme.words, columns) })), [filter, columns]);

  // Leaving the screen mid-recording stops the microphone and discards that take.
  useEffect(() => () => {
    if (autoStop.current) clearTimeout(autoStop.current);
    if (recordingRef.current) {
      recordingRef.current = null;
      void recorder.stop().catch(() => {}).finally(() => { void restorePlaybackAudioMode(); });
    }
  }, [recorder]);

  async function start(word: Word) {
    if (busy || recordingRef.current || !voice.ready) return;
    setBusy(true);
    setConfirmDeleteId(null);
    voice.stop();
    try {
      const permission = await requestRecordingPermissionsAsync();
      if (!permission.granted) {
        setPermissionDenied(true);
        setMessage('Microphone access is off, so words can\'t be recorded. You can turn it on in Settings.');
        return;
      }
      setPermissionDenied(false);
      await setAudioModeAsync(RECORDING_AUDIO_MODE);
      await recorder.prepareToRecordAsync();
      recorder.record();
      recordingRef.current = word.id;
      setRecordingId(word.id);
      setMessage(`Recording "${word.translit}"… say the word, then tap Stop.`);
      autoStop.current = setTimeout(() => { void stopRef.current(); }, MAX_RECORDING_MS);
    } catch {
      setMessage('Could not start recording. Please try again.');
      await restorePlaybackAudioMode();
    } finally { setBusy(false); }
  }

  async function stop() {
    const wordId = recordingRef.current;
    if (!wordId) return;
    if (autoStop.current) { clearTimeout(autoStop.current); autoStop.current = null; }
    recordingRef.current = null;
    setBusy(true);
    setMessage('Saving…');
    try {
      await recorder.stop();
      if (!recorder.uri) throw new Error('No recording file');
      await voice.save(wordId, recorder.uri);
      setMessage(Platform.OS === 'web' ? 'Saved for this visit (web preview: recordings are kept until the page reloads).' : 'Saved on this device.');
    } catch { setMessage('Could not save the recording. Please try again.'); }
    finally {
      setRecordingId(null);
      await restorePlaybackAudioMode();
      setBusy(false);
    }
  }
  useEffect(() => { stopRef.current = stop; });

  async function remove(word: Word) {
    setConfirmDeleteId(null);
    try { await voice.remove(word.id); setMessage(`Deleted the recording of "${word.translit}".`); }
    catch { setMessage('Could not delete the recording. Please try again.'); }
  }

  if (guard) return guard;
  const total = allWords.length;
  return (
    <Screen>
      <SectionList
        sections={sections}
        keyExtractor={(row) => row.map((word) => word.id).join('+')}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.content}
        ListHeaderComponent={<View style={styles.header}>
          <Pressable accessibilityRole="button" accessibilityLabel="Back to parent area" onPress={() => { if (router.canGoBack()) router.back(); else router.replace('/parent'); }} style={styles.back}>
            <Text style={styles.backText}>‹ Back</Text>
          </Pressable>
          <Text maxFontSizeMultiplier={DISPLAY_MAX_FONT_SCALE} accessibilityRole="header" style={styles.title}>Family voice</Text>
          <Text style={styles.body}>
            Record each word in your own voice{active ? ` for ${active.name}` : ''}. {active?.name ?? 'Your child'} hears it on word cards, in lessons and in Find the picture. Words you haven’t recorded stay pictures and text.
          </Text>
          <Text style={styles.privacy}>Recordings stay on this device. They are never uploaded or shared.</Text>
          <View accessible accessibilityRole="progressbar" accessibilityLabel={`${recordedCount} of ${total} words recorded`} accessibilityValue={{ min: 0, max: total, now: recordedCount }} style={styles.progress}>
            <Text style={styles.progressText}>{recordedCount} of {total} recorded</Text>
            <View style={styles.track}><View style={[styles.fill, { width: `${total ? (recordedCount / total) * 100 : 0}%` }]} /></View>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
            <FilterChip label="All" selected={filter === 'all'} onPress={() => setFilter('all')} />
            {ACTIVE_PACK.themes.map((theme) => {
              const done = theme.words.filter((word) => voice.uris[word.id]).length;
              return <FilterChip key={theme.id} label={`${theme.titleEn} ${done}/${theme.words.length}`} artWordId={themeArtWordId(theme.id)} emoji={theme.emoji}
                selected={filter === theme.id} onPress={() => setFilter(theme.id)} />;
            })}
          </ScrollView>
          {!!message && <Text accessibilityLiveRegion="polite" style={styles.message}>{message}</Text>}
          {permissionDenied && Platform.OS !== 'web' && <BigButton label="Open Settings" color={colors.textMuted} onPress={() => { void Linking.openSettings(); }} />}
        </View>}
        renderSectionHeader={({ section }) => <Text accessibilityRole="header" style={styles.section}>{section.title}</Text>}
        renderItem={({ item: row }) => (
          <View style={styles.rowGroup}>
            {row.map(renderWord)}
            {row.length < columns && <View style={styles.cell} />}
          </View>
        )}
      />
    </Screen>
  );

  function renderWord(word: Word) {
        const recorded = !!voice.uris[word.id];
        const isRecording = recordingId === word.id;
        const othersBusy = busy || (!!recordingId && !isRecording);
        return (
          <View key={word.id} style={[styles.row, styles.cell, isRecording && styles.rowRecording]}>
            <View style={styles.word}>
              <View accessible={false} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden><WordArt wordId={word.id} emoji={word.emoji} size={56} /></View>
              <View style={styles.wordText}>
                <Text style={styles.hy}>{word.hy}</Text>
                <Text style={styles.translit}>{word.translit} · {word.en}</Text>
                <Text style={[styles.status, recorded && styles.statusDone]}>{isRecording ? 'Recording…' : recorded ? 'Recorded' : 'Not recorded yet'}</Text>
              </View>
            </View>
            {confirmDeleteId === word.id ? (
              <View style={styles.buttons}>
                <Text style={styles.confirm}>Delete this recording?</Text>
                <BigButton label="Delete" color={colors.danger} onPress={() => { void remove(word); }} style={styles.button} />
                <BigButton label="Keep" color={colors.textMuted} onPress={() => setConfirmDeleteId(null)} style={styles.button} />
              </View>
            ) : (
              <View style={styles.buttons}>
                <BigButton
                  label={isRecording ? `Stop recording ${word.translit}` : `${recorded ? 'Re-record' : 'Record'} ${word.translit}`}
                  color={isRecording ? colors.danger : colors.primary}
                  onPress={() => { if (isRecording) void stop(); else void start(word); }}
                  disabled={othersBusy || !voice.ready}
                  style={styles.button}
                />
                {recorded && !isRecording && <>
                  <BigButton label={`Play ${word.translit}`} color={colors.success} onPress={() => { voice.play(word.id); }} disabled={othersBusy} style={styles.button} />
                  <BigButton label={`Delete ${word.translit}`} color={colors.textMuted} onPress={() => setConfirmDeleteId(word.id)} disabled={othersBusy} style={styles.button} />
                </>}
              </View>
            )}
          </View>
        );
  }
}

function FilterChip({ label, selected, onPress, artWordId, emoji }: { label: string; selected: boolean; onPress(): void; artWordId?: string; emoji?: string }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`Show ${label}`} {...selectedA11y(selected)} onPress={onPress} style={[styles.chip, selected && styles.chipSelected]}>
      {artWordId && <View accessible={false} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden><WordArt wordId={artWordId} emoji={emoji ?? ''} size={24} /></View>}
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.md, paddingBottom: spacing.xxl },
  header: { gap: spacing.md },
  back: { minHeight: TOUCH_MIN, justifyContent: 'center' },
  backText: { color: colors.primaryText, fontSize: font.body, fontWeight: '700' },
  title: { color: colors.text, fontSize: font.title, fontWeight: '800' },
  body: { color: colors.text, fontSize: font.body },
  privacy: { color: colors.textMuted, fontSize: font.body },
  progress: { gap: spacing.xs },
  progressText: { color: colors.text, fontSize: font.body, fontWeight: '700' },
  track: { height: 12, borderRadius: radius.md, backgroundColor: colors.border, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: colors.success },
  filters: { gap: spacing.sm, paddingVertical: spacing.xs },
  chip: { minHeight: TOUCH_MIN, flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.md, borderRadius: radius.lg, borderWidth: 2, borderColor: colors.border, backgroundColor: colors.surface },
  chipSelected: { borderColor: colors.primary, backgroundColor: colors.primary },
  chipText: { color: colors.text, fontSize: font.body, fontWeight: '700' },
  chipTextSelected: { color: '#FFFFFF' },
  message: { color: colors.text, fontSize: font.body, fontWeight: '600' },
  section: { color: colors.text, fontSize: font.heading, fontWeight: '800', marginTop: spacing.sm },
  rowGroup: { flexDirection: 'row', gap: spacing.md },
  cell: { flex: 1 },
  row: { padding: spacing.md, gap: spacing.sm, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 2, borderColor: 'transparent' },
  rowRecording: { borderColor: colors.danger },
  word: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  wordText: { flexShrink: 1, gap: 2 },
  hy: { color: colors.text, fontSize: font.heading, fontWeight: '800' },
  translit: { color: colors.textMuted, fontSize: font.body },
  status: { color: colors.textMuted, fontSize: font.body },
  statusDone: { color: colors.success, fontWeight: '700' },
  buttons: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: spacing.sm },
  confirm: { color: colors.text, fontSize: font.body, fontWeight: '700', width: '100%' },
  button: { minWidth: 120, flexGrow: 1 },
});
