import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ProfileAvatar } from '@/features/profiles/ProfileAvatar';
import { useProfiles } from '@/state/profiles';
import { BigButton } from '@/ui/BigButton';
import { Screen } from '@/ui/Screen';
import { colors, font, radius, spacing, TOUCH_MIN } from '@/ui/tokens';
export default function ProfilesPicker() {
  const { profiles, activeId, isPremium, switchTo } = useProfiles();
  const [busy, setBusy] = useState(false);
  const choose = async (id: string, locked: boolean) => { if (busy) return; if (locked) { router.push({ pathname: '/parent-gate', params: { next: '/parent/paywall', reason: 'children' } }); return; } setBusy(true); try { await switchTo(id); router.replace('/'); } catch { Alert.alert('Could not switch', 'Please try again after saving progress.'); } finally { setBusy(false); } };
  return <Screen><ScrollView contentContainerStyle={styles.content}>
    <Text accessibilityRole="header" style={styles.title}>Who is learning?</Text>
    <View style={styles.grid}>{profiles.map((profile, index) => <Pressable key={profile.id} accessibilityRole="button" accessibilityLabel={index > 0 && !isPremium ? `${profile.name}, locked` : `Learn as ${profile.name}`} disabled={busy} accessibilityState={{ selected: profile.id === activeId, disabled: busy }} onPress={() => void choose(profile.id, index > 0 && !isPremium)} style={[styles.tile, profile.id === activeId && styles.active]}>
      <ProfileAvatar wordId={profile.avatarWordId} size={82} />
      <Text style={styles.name}>{profile.name}</Text>
      {index > 0 && !isPremium ? <Text style={styles.name}>🔒 Premium</Text> : null}
    </Pressable>)}</View>
    <BigButton label="Back to home" color={colors.textMuted} onPress={() => router.replace('/')} />
  </ScrollView></Screen>;
}
const styles = StyleSheet.create({ content: { gap: spacing.lg, paddingVertical: spacing.lg }, title: { color: colors.text, fontSize: font.title, fontWeight: '800', textAlign: 'center' }, grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }, tile: { width: '47%', minHeight: TOUCH_MIN * 3, backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', gap: spacing.sm }, active: { borderColor: colors.success }, name: { color: colors.text, fontSize: font.heading, fontWeight: '800' } });
