import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { ProfileAvatar } from '@/features/profiles/ProfileAvatar';
import { useProfiles } from '@/state/profiles';
import { BigButton } from '@/ui/BigButton';
import { Icon } from '@/ui/Icon';
import { Screen } from '@/ui/Screen';
import { selectedA11y } from '@/ui/selectedA11y';
import { colors, DISPLAY_MAX_FONT_SCALE, font, radius, spacing, TOUCH_MIN, WIDE_BREAKPOINT } from '@/ui/tokens';
import { notify } from '@/lib/dialog';
/** Phone card avatar: it was 82 px in a ~160 px card and looked small beside the name (#114). */
const PHONE_AVATAR = 112;

export default function ProfilesPicker() {
  const { profiles, activeId, isPremium, switchTo } = useProfiles();
  const [busy, setBusy] = useState(false);
  // Wide windows: 3 cards a row with bigger pictures instead of 2 long flat cards.
  const wide = useWindowDimensions().width >= WIDE_BREAKPOINT;
  const choose = async (id: string, locked: boolean) => { if (busy) return; if (locked) { router.push({ pathname: '/parent-gate', params: { next: '/parent/paywall', reason: 'children' } }); return; } setBusy(true); try { await switchTo(id); router.replace('/'); } catch { notify('Could not switch', 'Please try again after saving progress.'); } finally { setBusy(false); } };
  return <Screen><ScrollView contentContainerStyle={styles.content}>
    <Text maxFontSizeMultiplier={DISPLAY_MAX_FONT_SCALE} accessibilityRole="header" style={styles.title}>Who is learning?</Text>
    <View style={styles.grid}>{profiles.map((profile, index) => <Pressable key={profile.id} accessibilityRole="button" accessibilityLabel={index > 0 && !isPremium ? `${profile.name}, locked` : `Learn as ${profile.name}`} disabled={busy} accessibilityState={{ disabled: busy }} {...selectedA11y(profile.id === activeId)} onPress={() => void choose(profile.id, index > 0 && !isPremium)} style={[styles.tile, wide && styles.tileWide, profile.id === activeId && styles.active]}>
      <ProfileAvatar wordId={profile.avatarWordId} size={wide ? 120 : PHONE_AVATAR} />
      <Text style={styles.name}>{profile.name}</Text>
      {index > 0 && !isPremium ? <View style={styles.locked}><Icon name="lock" size={24} /><Text style={styles.name}>Premium</Text></View> : null}
    </Pressable>)}</View>
    <BigButton label="Back to home" color={colors.textMuted} onPress={() => router.replace('/')} />
    {/* A grown-up adds a brother or sister from here, through the gate (#114); grey and after the child's button (#97). */}
    <BigButton label="Grown-ups: add a child" color={colors.textMuted} onPress={() => router.push({ pathname: '/parent-gate', params: { next: '/parent/children' } })} />
  </ScrollView></Screen>;
}
const styles = StyleSheet.create({ content: { gap: spacing.lg, paddingVertical: spacing.lg }, title: { color: colors.text, fontSize: font.title, fontWeight: '800', textAlign: 'center' }, grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }, tile: { width: '47%', minHeight: TOUCH_MIN * 3, backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', gap: spacing.sm }, tileWide: { width: '31%', minHeight: TOUCH_MIN * 3.5 }, active: { borderColor: colors.success }, name: { color: colors.text, fontSize: font.heading, fontWeight: '800' }, locked: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs } });
