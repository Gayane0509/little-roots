export interface Letter {
  upper: string;
  lower: string;
  /** Traditional letter name, e.g. "Ayb". */
  name: string;
  /** Approximate Latin sound for parents. */
  sound: string;
  example: { hy: string; translit: string; en: string; emoji: string };
}

/**
 * The modern Eastern Armenian primer set of 39 letters, in order. Ու is a digraph taught as one letter; և ("and")
 * is the ligature taught between Ք and Օ, shown the same in upper and lower case.
 */
export const ALPHABET: Letter[] = [
  { upper: 'Ա', lower: 'ա', name: 'Ayb', sound: 'a (as in "father")', example: { hy: 'արջ', translit: 'arj', en: 'bear', emoji: '🐻' } },
  { upper: 'Բ', lower: 'բ', name: 'Ben', sound: 'b', example: { hy: 'բադ', translit: 'bad', en: 'duck', emoji: '🦆' } },
  { upper: 'Գ', lower: 'գ', name: 'Gim', sound: 'g', example: { hy: 'գազար', translit: 'gazar', en: 'carrot', emoji: '🥕' } },
  { upper: 'Դ', lower: 'դ', name: 'Da', sound: 'd', example: { hy: 'դուռ', translit: 'dur', en: 'door', emoji: '🚪' } },
  { upper: 'Ե', lower: 'ե', name: 'Yech', sound: 'ye (e inside a word)', example: { hy: 'եղնիկ', translit: 'yeghnik', en: 'deer', emoji: '🦌' } },
  { upper: 'Զ', lower: 'զ', name: 'Za', sound: 'z', example: { hy: 'զանգ', translit: 'zang', en: 'bell', emoji: '🔔' } },
  { upper: 'Է', lower: 'է', name: 'E', sound: 'e (as in "bed")', example: { hy: 'էջ', translit: 'ej', en: 'page', emoji: '📄' } },
  { upper: 'Ը', lower: 'ը', name: 'Ət', sound: 'ə (a short "uh")', example: { hy: 'ընկույզ', translit: 'ənkuyz', en: 'walnut', emoji: '🌰' } },
  { upper: 'Թ', lower: 'թ', name: 'To', sound: 't (breathy)', example: { hy: 'թռչուն', translit: 'trchun', en: 'bird', emoji: '🐦' } },
  { upper: 'Ժ', lower: 'ժ', name: 'Zhe', sound: 'zh (as in "measure")', example: { hy: 'ժամացույց', translit: 'zhamatsuyts', en: 'clock', emoji: '⏰' } },
  { upper: 'Ի', lower: 'ի', name: 'Ini', sound: 'i (as in "machine")', example: { hy: 'ինքնաթիռ', translit: 'inknatir', en: 'airplane', emoji: '✈️' } },
  { upper: 'Լ', lower: 'լ', name: 'Lyun', sound: 'l', example: { hy: 'լուսին', translit: 'lusin', en: 'moon', emoji: '🌙' } },
  { upper: 'Խ', lower: 'խ', name: 'Khe', sound: 'kh (like Scottish "loch")', example: { hy: 'խնձոր', translit: 'khndzor', en: 'apple', emoji: '🍎' } },
  { upper: 'Ծ', lower: 'ծ', name: 'Tsa', sound: 'ts (as in "cats")', example: { hy: 'ծառ', translit: 'tsar', en: 'tree', emoji: '🌳' } },
  { upper: 'Կ', lower: 'կ', name: 'Ken', sound: 'k', example: { hy: 'կատու', translit: 'katu', en: 'cat', emoji: '🐱' } },
  { upper: 'Հ', lower: 'հ', name: 'Ho', sound: 'h', example: { hy: 'հաց', translit: 'hats', en: 'bread', emoji: '🍞' } },
  { upper: 'Ձ', lower: 'ձ', name: 'Dza', sound: 'dz (as in "adds")', example: { hy: 'ձու', translit: 'dzu', en: 'egg', emoji: '🥚' } },
  { upper: 'Ղ', lower: 'ղ', name: 'Ghat', sound: 'gh (a soft throaty r)', example: { hy: 'ղեկ', translit: 'ghek', en: "ship's wheel", emoji: '🚢' } },
  { upper: 'Ճ', lower: 'ճ', name: 'Che', sound: 'ch', example: { hy: 'ճուտ', translit: 'chut', en: 'chick', emoji: '🐥' } },
  { upper: 'Մ', lower: 'մ', name: 'Men', sound: 'm', example: { hy: 'մայրիկ', translit: 'mayrik', en: 'mom', emoji: '👩' } },
  { upper: 'Յ', lower: 'յ', name: 'Hi', sound: 'y (as in "yes")', example: { hy: 'յոթ', translit: 'yot', en: 'seven', emoji: '7️⃣' } },
  { upper: 'Ն', lower: 'ն', name: 'Nu', sound: 'n', example: { hy: 'նարինջ', translit: 'narinj', en: 'orange', emoji: '🍊' } },
  { upper: 'Շ', lower: 'շ', name: 'Sha', sound: 'sh', example: { hy: 'շուն', translit: 'shun', en: 'dog', emoji: '🐶' } },
  { upper: 'Ո', lower: 'ո', name: 'Vo', sound: 'vo (o inside a word)', example: { hy: 'ոչխար', translit: 'vochkhar', en: 'sheep', emoji: '🐑' } },
  { upper: 'Չ', lower: 'չ', name: 'Cha', sound: 'ch (breathy)', example: { hy: 'չորս', translit: 'chors', en: 'four', emoji: '4️⃣' } },
  { upper: 'Պ', lower: 'պ', name: 'Pe', sound: 'p', example: { hy: 'պապիկ', translit: 'papik', en: 'grandpa', emoji: '👴' } },
  { upper: 'Ջ', lower: 'ջ', name: 'Je', sound: 'j (as in "jam")', example: { hy: 'ջուր', translit: 'jur', en: 'water', emoji: '💧' } },
  { upper: 'Ռ', lower: 'ռ', name: 'Rra', sound: 'rr (strong rolled r)', example: { hy: 'ռադիո', translit: 'radio', en: 'radio', emoji: '📻' } },
  { upper: 'Ս', lower: 'ս', name: 'Se', sound: 's', example: { hy: 'սիրտ', translit: 'sirt', en: 'heart', emoji: '❤️' } },
  { upper: 'Վ', lower: 'վ', name: 'Vev', sound: 'v', example: { hy: 'վարդ', translit: 'vard', en: 'rose', emoji: '🌹' } },
  { upper: 'Տ', lower: 'տ', name: 'Tyun', sound: 't', example: { hy: 'տուն', translit: 'tun', en: 'house', emoji: '🏠' } },
  { upper: 'Ր', lower: 'ր', name: 'Re', sound: 'r (soft, single tap)', example: { hy: 'րոպե', translit: 'rope', en: 'minute', emoji: '⏱️' } },
  { upper: 'Ց', lower: 'ց', name: 'Tso', sound: 'ts (breathy)', example: { hy: 'ցորեն', translit: 'tsoren', en: 'wheat', emoji: '🌾' } },
  { upper: 'Ու', lower: 'ու', name: 'U', sound: 'u (as in "moon")', example: { hy: 'ուլ', translit: 'ul', en: 'baby goat', emoji: '🐐' } },
  { upper: 'Փ', lower: 'փ', name: 'Pyur', sound: 'p (breathy)', example: { hy: 'փիղ', translit: 'pigh', en: 'elephant', emoji: '🐘' } },
  { upper: 'Ք', lower: 'ք', name: 'Ke', sound: 'k (breathy)', example: { hy: 'քիթ', translit: 'kit', en: 'nose', emoji: '👃' } },
  { upper: 'և', lower: 'և', name: 'Yev', sound: 'yev / ev', example: { hy: 'արև', translit: 'arev', en: 'sun', emoji: '🌞' } },
  { upper: 'Օ', lower: 'օ', name: 'O', sound: 'o (as in "go")', example: { hy: 'օձ', translit: 'odz', en: 'snake', emoji: '🐍' } },
  { upper: 'Ֆ', lower: 'ֆ', name: 'Fe', sound: 'f', example: { hy: 'ֆուտբոլ', translit: 'futbol', en: 'football', emoji: '⚽' } },
];
