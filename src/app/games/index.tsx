import { router, type Href } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { goBackOrHome } from '@/lib/navigation';
import { BigButton } from '@/ui/BigButton';
import { Screen } from '@/ui/Screen';
import { colors, font, radius, spacing, TOUCH_MIN } from '@/ui/tokens';

const GAMES: { href: Href; emoji: string; title: string; sub: string; color: string }[] = [
  { href: '/games/memory', emoji: '🧠', title: 'Memory match', sub: 'Find the pairs', color: '#FFD6A5' },
  { href: '/games/listen', emoji: '👂', title: 'Listen & find', sub: 'Hear it, tap the picture', color: '#CDE7FF' },
  { href: '/games/read', emoji: '📖', title: 'Read it', sub: 'For readers: pick the word', color: '#CAFFBF' },
];

export default function Games() {
  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title} accessibilityRole="header">🎮 Games</Text>
        {GAMES.map((game) => (
          <Pressable
            key={game.title}
            accessibilityRole="button"
            accessibilityLabel={game.title}
            accessibilityHint={game.sub}
            onPress={() => router.push(game.href)}
            style={({ pressed }) => [styles.card, { backgroundColor: game.color, transform: [{ scale: pressed ? 0.97 : 1 }] }]}
          >
            <Text style={styles.emoji}>{game.emoji}</Text>
            <Text style={styles.cardTitle}>{game.title}</Text>
            <Text style={styles.cardSub}>{game.sub}</Text>
          </Pressable>
        ))}
        <BigButton label="Back" color={colors.textMuted} onPress={goBackOrHome} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.md, paddingBottom: spacing.xl },
  title: { fontSize: font.title, fontWeight: '800', color: colors.text, textAlign: 'center' },
  card: {
    minHeight: TOUCH_MIN + 70,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    gap: spacing.xs,
  },
  emoji: { fontSize: 48 },
  cardTitle: { fontSize: font.title, fontWeight: '800', color: colors.text },
  cardSub: { fontSize: font.body, fontWeight: '600', color: colors.textMuted },
});
