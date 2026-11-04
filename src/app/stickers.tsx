
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { OutfitPicker } from '@/features/stickers/OutfitPicker';
import { StickerTile } from '@/features/stickers/StickerTile';
import { wordIdForSticker } from '@/features/stickers/stickerArt';
import { useBuddyLine } from '@/features/buddy/useBuddyLine';
import { goBackOrHome } from '@/lib/navigation';
import { wornOutfit } from '@/lib/outfits';
import { useProgress } from '@/state/progress';
import { BigButton } from '@/ui/BigButton';
import { Buddy, BUDDY_NAME } from '@/ui/Buddy';
import { IconTitle } from '@/ui/IconTitle';
import { Screen } from '@/ui/Screen';
import { colors, font, radius, spacing } from '@/ui/tokens';

const MIN_SLOTS = 24;

export default function Stickers() {
  const line = useBuddyLine();
  const { state, setBuddyOutfit } = useProgress();
  const worn = wornOutfit(state);
  const stickers = state.stickers;
  const slots = Math.max(MIN_SLOTS, Math.ceil(stickers.length / 3) * 3);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <IconTitle icon="stickers" text="Sticker book" style={styles.title} />
        {stickers.length === 0 ? (
          <Buddy mood="think" message={line('stickers_empty')} />
        ) : (
          <Text style={styles.sub} accessibilityLabel={`${stickers.length} of ${slots} stickers`}>
            {stickers.length} of {slots} stickers
          </Text>
        )}
        <View style={styles.dressUp}>
          <View style={styles.dressUpHead}>
            <Buddy mood="happy" outfit={worn} size={88} />
            <Text style={styles.heading} accessibilityRole="header">Dress up {BUDDY_NAME.hy}</Text>
          </View>
          <OutfitPicker stickerCount={stickers.length} worn={worn} onPick={setBuddyOutfit} />
        </View>
        <View style={styles.grid}>
          {Array.from({ length: slots }, (_, i) => (
            <StickerTile key={i} emoji={stickers[i] ?? null} index={i} wordId={stickers[i] ? wordIdForSticker(stickers[i]) : undefined} />
          ))}
        </View>
        <BigButton label="Back" color={colors.textMuted} onPress={goBackOrHome} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.md, paddingBottom: spacing.xl },
  title: { fontSize: font.title, fontWeight: '800', color: colors.text },
  dressUp: { gap: spacing.sm, backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 2, borderColor: colors.border, padding: spacing.md },
  dressUpHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  heading: { flexShrink: 1, fontSize: font.heading, fontWeight: '800', color: colors.text },
  sub: { fontSize: font.body, color: colors.textMuted },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: spacing.md },
});
