import { router } from 'expo-router';
import { RecordingPresets, requestRecordingPermissionsAsync, setAudioModeAsync, useAudioRecorder } from 'expo-audio';
import { useEffect, useRef, useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { THEMES } from '@/content/themes';
import type { Word } from '@/content/types';
import { useParentGuard } from '@/features/parent/gate';
import { useArmenianVoiceAvailable } from '@/lib/speech';
import { useRecordings, useSpeakWord } from '@/state/recordings';
import { BigButton } from '@/ui/BigButton';
import { Screen } from '@/ui/Screen';
import { colors, font, radius, spacing, TOUCH_MIN } from '@/ui/tokens';

export default function FamilyVoicesScreen() {
  const guard = useParentGuard('/parent/voices');
  const { ready, uris, saveRecording, deleteRecording } = useRecordings();
  const speakWord = useSpeakWord();
  const voiceAvailable = useArmenianVoiceAvailable();
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [recordingId, setRecordingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const recordingRef = useRef<string | null>(null);

  useEffect(() => () => {
    if (recordingRef.current) void recorder.stop().catch(() => {}).finally(() => setAudioModeAsync({ allowsRecording: false }).catch(() => {}));
  }, [recorder]);

  async function start(word: Word) {
    if (Platform.OS === 'web') { setMessage('Recording is unavailable in the web app. Please use your phone.'); return; }
    if (!ready || busy || recordingRef.current) return;
    setBusy(true);
    try {
      const permission = await requestRecordingPermissionsAsync();
      if (!permission.granted) { setMessage('Microphone permission is needed to record your voice.'); return; }
      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
      await recorder.prepareToRecordAsync();
      recorder.record();
      recordingRef.current = word.id;
      setRecordingId(word.id);
      setMessage(`Recording ${word.en}…`);
    } catch { setMessage('Could not start recording. Please try again.');
      await setAudioModeAsync({ allowsRecording: false }).catch(() => {});
    } finally { setBusy(false); }
  }

  async function stop() {
    const wordId = recordingRef.current;
    if (!wordId || busy) return;
    setBusy(true);
    try {
      await recorder.stop();
      if (!recorder.uri) throw new Error('No recording file');
      await saveRecording(wordId, recorder.uri);
      setMessage('Saved on this device.');
    } catch { setMessage('Could not save the recording. Please try again.'); }
    finally {
      recordingRef.current = null;
      setRecordingId(null);
      await setAudioModeAsync({ allowsRecording: false }).catch(() => {});
      setBusy(false);
    }
  }

  function confirmDelete(word: Word) {
    Alert.alert('Delete recording?', `Remove your recording for ${word.en}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => { void deleteRecording(word.id).catch(() => setMessage('Could not delete recording.')); } },
    ]);
  }

  if (guard) return guard;
  return <Screen>
    <ScrollView contentContainerStyle={styles.content}>
      <Pressable accessibilityRole="button" accessibilityLabel="Back to parent area" onPress={() => router.back()} style={styles.back}><Text style={styles.backText}>‹ Back</Text></Pressable>
      <Text style={styles.heading}>Family voice — record words in your own voice. Recordings stay on this device.</Text>
      {voiceAvailable === false && <View style={styles.banner}><Text style={styles.bannerText}>This device has no Armenian voice. Record words so your child hears them.</Text></View>}
      {!!message && <Text accessibilityLiveRegion="polite" style={styles.message}>{message}</Text>}
      {THEMES.map((theme) => <View key={theme.id} style={styles.section}>
        <Text style={styles.theme}>{theme.emoji} {theme.titleEn}</Text>
        {theme.words.map((word) => <View key={word.id} style={styles.row}>
          <View style={styles.word}><Text style={styles.wordHy}>{word.emoji} {word.hy}</Text><Text style={styles.wordEn}>{word.en}</Text></View>
          <View style={styles.buttons}>
            <BigButton label="Play" onPress={() => speakWord(word)} disabled={!!recordingId || busy} style={styles.button} />
            <BigButton label={recordingId === word.id ? 'Stop' : uris[word.id] ? 'Re-record' : 'Record'}
              onPress={() => { if (recordingId === word.id) void stop(); else void start(word); }}
              disabled={busy || (!!recordingId && recordingId !== word.id) || !ready} style={styles.button} />
            {uris[word.id] && <BigButton label="Delete" color={colors.danger} onPress={() => confirmDelete(word)} disabled={!!recordingId || busy} style={styles.button} />}
          </View>
        </View>)}
      </View>)}
    </ScrollView>
  </Screen>;
}

const styles = StyleSheet.create({
  content: { gap: spacing.lg, paddingBottom: spacing.xxl },
  back: { minHeight: TOUCH_MIN, justifyContent: 'center' },
  backText: { color: colors.primaryDark, fontSize: font.body, fontWeight: '700' },
  heading: { color: colors.text, fontSize: font.heading, fontWeight: '800' },
  banner: { padding: spacing.md, backgroundColor: '#FFF0DF', borderRadius: radius.md },
  bannerText: { color: colors.text, fontSize: font.body },
  message: { color: colors.textMuted, fontSize: font.body },
  section: { gap: spacing.md },
  theme: { color: colors.text, fontSize: font.heading, fontWeight: '800' },
  row: { padding: spacing.md, backgroundColor: colors.surface, borderRadius: radius.md, gap: spacing.sm },
  word: { gap: spacing.xs },
  wordHy: { color: colors.text, fontSize: font.heading, fontWeight: '700' },
  wordEn: { color: colors.textMuted, fontSize: font.body },
  buttons: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  button: { minWidth: 100, flexGrow: 1 },
});
