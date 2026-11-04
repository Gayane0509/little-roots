
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';

import { AVATAR_WORD_IDS, useProfiles, type AvatarWordId } from '@/state/profiles';
import { useBuddyLine } from '@/features/buddy/useBuddyLine';
import { ProfileAvatar } from '@/features/profiles/ProfileAvatar';
import { BigButton } from '@/ui/BigButton';
import { Buddy } from '@/ui/Buddy';
import { Screen } from '@/ui/Screen';
import { selectedA11y } from '@/ui/selectedA11y';
import { colors, CONTENT_MAX_WIDTH, DISPLAY_MAX_FONT_SCALE, font, radius, spacing, TOUCH_MIN, WIDE_BREAKPOINT } from '@/ui/tokens';

export default function Onboarding() {
  const line = useBuddyLine();
  const { add } = useProfiles();
  const [avatar, setAvatar] = useState<AvatarWordId>('family.child');
  const [busy, setBusy] = useState(false);
  const { width } = useWindowDimensions();
  // Avatar tiles are 31 % of the content column; on wide windows the picture grows with the tile (phones keep 64).
  const avatarArt = width >= WIDE_BREAKPOINT ? Math.min(140, Math.round(Math.min(width - spacing.md * 2, CONTENT_MAX_WIDTH) * 0.31 * 0.6)) : 64;
  const busyRef = useRef(false);
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const [name, setName] = useState('');

  const finish = async (value: string) => {
    if (busyRef.current) return;
    busyRef.current = true; setBusy(true);
    try {
      if (await add(value.trim() || 'Friend', avatar, { activate: true })) router.replace('/');
      else { Alert.alert('Child limit reached', 'Ask a grown-up about Premium.'); router.push({ pathname: '/parent-gate', params: { next: '/parent/paywall', reason: 'children' } }); }
    } catch { Alert.alert('Could not save', 'Please try again.'); }
    finally { busyRef.current = false; if (mounted.current) setBusy(false); }
  };

  return (
    <Screen>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Buddy mood="cheer" message={line('onboarding_intro')} />
          <Text maxFontSizeMultiplier={DISPLAY_MAX_FONT_SCALE} accessibilityRole="header" style={styles.question}>What is your name?</Text>
          <TextInput
            accessibilityLabel="Child's first name"
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="First name"
            placeholderTextColor={colors.textMuted}
            maxLength={20}
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={() => void finish(name)}
          />
          <Text style={styles.note}>Choose your picture</Text>
          <View style={styles.avatars}>{AVATAR_WORD_IDS.map((id) => <Pressable key={id} accessibilityRole="button" accessibilityLabel={`${id.split('.')[1]} avatar`} {...selectedA11y(avatar === id)} onPress={() => setAvatar(id)} style={[styles.avatar, avatar === id && styles.selected]}><ProfileAvatar wordId={id} size={avatarArt} /></Pressable>)}</View>
          <Text style={styles.note}>Stays on this device only.</Text>
          <BigButton label="Let's go!" disabled={busy} onPress={() => void finish(name)} />
          <BigButton label="Skip" color={colors.textMuted} disabled={busy} onPress={() => void finish('')} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { gap: spacing.lg, paddingVertical: spacing.lg },
  question: { fontSize: font.title, fontWeight: '800', color: colors.text },
  input: {
    minHeight: TOUCH_MIN,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    fontSize: font.heading,
    color: colors.text,
  },
  // Six pictures as a 3 × 2 grid of big targets (no lone picture on a second row).
  avatars: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: spacing.md },
  avatar: { width: '31%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center', borderRadius: radius.md, borderWidth: 3, borderColor: colors.border, backgroundColor: colors.surface },
  selected: { borderColor: colors.success, borderWidth: 4, backgroundColor: '#E9F8EF' },
  note: { fontSize: font.small, color: colors.textMuted },
});
