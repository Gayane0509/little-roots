import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { StickerTile } from '@/features/stickers/StickerTile';
import { goBackOrHome } from '@/lib/navigation';
import { useProgress } from '@/state/progress';
import { BigButton } from '@/ui/BigButton';
import { Buddy } from '@/ui/Buddy';
import { Screen } from '@/ui/Screen';
import { colors, font, spacing } from '@/ui/tokens';

const MIN_SLOTS = 24;

export default function Stickers() {
  const { state } = useProgress();
  const stickers = state.stickers;
  const slots = Math.max(MIN_SLOTS, Math.ceil(stickers.length / 3) * 3);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>⭐ Sticker book</Text>
        {stickers.length === 0 ? (
          <Buddy mood="think" message="Your book is empty. Finish a lesson to get your first sticker!" />
        ) : (
          <Text style={styles.sub} accessibilityLabel={`${stickers.length} of ${slots} stickers`}>
            {stickers.length} of {slots} stickers
          </Text>
        )}
        <View style={styles.grid}>
          {Array.from({ length: slots }, (_, i) => (
            <StickerTile key={i} emoji={stickers[i] ?? null} index={i} />
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
  sub: { fontSize: font.body, color: colors.textMuted },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: spacing.md },
});
