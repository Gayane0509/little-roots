import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useParentGuard } from '@/features/parent/gate';
import { ProfileAvatar } from '@/features/profiles/ProfileAvatar';
import { canAddProfile, MAX_PROFILES } from '@/lib/entitlements';
import { AVATAR_WORD_IDS, useProfiles, type AvatarWordId } from '@/state/profiles';
import { BigButton } from '@/ui/BigButton';
import { Screen } from '@/ui/Screen';
import { colors, font, radius, spacing, TOUCH_MIN } from '@/ui/tokens';
export default function Children() {
  const guard = useParentGuard('/parent/children');
  const { profiles, isPremium, add, rename, remove } = useProfiles();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState<AvatarWordId>('family.child');
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const begin = () => { if (busyRef.current) return false; busyRef.current = true; setBusy(true); return true; };
  const end = () => { busyRef.current = false; if (mounted.current) setBusy(false); };
  if (guard) return guard;
  const start = (id: string | null) => { const profile = profiles.find((p) => p.id === id); setEditingId(id ?? 'new'); setName(profile?.name ?? ''); setAvatar(profile?.avatarWordId ?? 'family.child'); };
  const save = async () => {
    if (!begin()) return;
    try {
      if (editingId === 'new') {
        const added = await add(name, avatar, { activate: false });
        if (!added) { Alert.alert('Child limit reached', 'Explore Premium to add another child.'); router.push({ pathname: '/parent/paywall', params: { reason: 'children' } }); return; }
      } else if (editingId) await rename(editingId, name, avatar);
      if (mounted.current) setEditingId(null);
    } catch { Alert.alert('Could not save', 'Please try again.'); } finally { end(); }
  };
  const confirmDelete = (id: string, childName: string) => {
    if (busyRef.current) return;
    Alert.alert(`Delete ${childName}?`, 'Their learning progress and traced letters will be removed from this device.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: () => {
      if (!begin()) return;
      void remove(id).catch(() => Alert.alert('Could not delete', 'Please try again.')).finally(end);
    } }]);
  };
  return <Screen><ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
    <Text accessibilityRole="header" style={styles.title}>Children</Text>
    {profiles.map((profile) => <View key={profile.id} style={styles.row}><ProfileAvatar wordId={profile.avatarWordId} size={56} /><Text style={styles.name}>{profile.name}</Text><Pressable accessibilityRole="button" accessibilityLabel={`Edit ${profile.name}`} disabled={busy} accessibilityState={{ disabled: busy }} style={styles.action} onPress={() => start(profile.id)}><Text style={styles.link}>Edit</Text></Pressable>{profiles.length > 1 ? <Pressable accessibilityRole="button" accessibilityLabel={`Delete ${profile.name}`} disabled={busy} accessibilityState={{ disabled: busy }} style={styles.action} onPress={() => confirmDelete(profile.id, profile.name)}><Text style={styles.delete}>Delete</Text></Pressable> : null}</View>)}
    {editingId ? <View style={styles.editor}><Text accessibilityRole="header" style={styles.heading}>{editingId === 'new' ? 'Add child' : 'Edit child'}</Text><TextInput accessibilityLabel="Child's name" style={styles.input} value={name} onChangeText={setName} maxLength={20} placeholder="First name" autoCorrect={false} /><View style={styles.avatars}>{AVATAR_WORD_IDS.map((id) => <Pressable key={id} accessibilityRole="button" accessibilityLabel={`${id.split('.')[1]} avatar`} accessibilityState={{ selected: avatar === id }} onPress={() => setAvatar(id)} style={[styles.avatar, avatar === id && styles.selected]}><ProfileAvatar wordId={id} size={48} /></Pressable>)}</View><BigButton label="Save child" disabled={busy} onPress={() => void save()} /><BigButton label="Cancel" color={colors.textMuted} onPress={() => setEditingId(null)} /></View> : null}
    {profiles.length < MAX_PROFILES && !editingId ? <BigButton label="Add child" onPress={() => canAddProfile(isPremium, profiles.length) ? start(null) : router.push({ pathname: '/parent/paywall', params: { reason: 'children' } })} /> : null}
    <BigButton label="Back to parents" color={colors.textMuted} onPress={() => router.replace('/parent')} />
  </ScrollView></Screen>;
}
const styles = StyleSheet.create({ content: { gap: spacing.md, paddingVertical: spacing.lg }, title: { fontSize: font.title, color: colors.text, fontWeight: '800' }, row: { minHeight: 76, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.sm, backgroundColor: colors.surface, borderRadius: radius.md }, name: { flex: 1, color: colors.text, fontSize: font.heading, fontWeight: '700' }, action: { minWidth: TOUCH_MIN, minHeight: TOUCH_MIN, paddingHorizontal: spacing.sm, alignItems: 'center', justifyContent: 'center' }, link: { color: colors.primaryText, fontSize: font.body }, delete: { color: colors.dangerText, fontSize: font.body }, editor: { gap: spacing.md, padding: spacing.md, backgroundColor: colors.surface, borderRadius: radius.md }, heading: { color: colors.text, fontSize: font.heading, fontWeight: '800' }, input: { minHeight: TOUCH_MIN, borderWidth: 2, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: spacing.md, color: colors.text, fontSize: font.body }, avatars: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }, avatar: { minWidth: 64, minHeight: 64, alignItems: 'center', justifyContent: 'center', borderRadius: radius.md, borderWidth: 2, borderColor: colors.border }, selected: { borderColor: colors.success } });
