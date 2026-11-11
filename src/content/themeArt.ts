import type { ThemeId } from './types';

const words: Record<ThemeId, string> = {
  family: 'family.mom', food: 'food.apple', animals: 'animals.cat', colors: 'colors.red',
  numbers: 'numbers.three', body: 'body.hand', clothes: 'clothes.shirt', home: 'home.house',
  toys: 'toys.ball', nature: 'nature.sun', transport: 'transport.car', feelings: 'feelings.happy',
  school: 'school.school', weather: 'weather.rainbow',
};

export function themeArtWordId(themeId: ThemeId): string {
  return words[themeId];
}
