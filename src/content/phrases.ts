export type Phrase = { hy: string; translit: string; en: string };

/** Child-facing Buddy lines. Placeholders: {name} {count} {moves} {score} {total}. */
export const PHRASES = {
  greeting: { hy: 'Բարև, {name}։', translit: 'Barev, {name}.', en: 'Hello, {name}!' },
  greeting_anon: { hy: 'Բարև։', translit: 'Barev.', en: 'Hello!' },
  onboarding_intro: { hy: 'Բարև։ Ես Արջուկն եմ։', translit: 'Barev. Yes Arjukn em.', en: 'Hi! I am Little Bear.' },
  who_is_learning: { hy: 'Ո՞վ է սովորում։', translit: 'Vo՞v e sovorum.', en: 'Who is learning?' },
  lesson_loading: { hy: 'Մի փոքր սպասիր…', translit: 'Mi pokr spasir…', en: 'Getting your lesson ready…' },
  lesson_new_words: { hy: 'Եկ սովորենք {count} նոր բառ։', translit: 'Yek sovorenk {count} nor bar.', en: "Let's learn {count} new words!" },
  lesson_practice: { hy: 'Եկ կրկնենք մեր բառերը։', translit: 'Yek krknenk mer barery.', en: "Let's practice our words!" },
  lesson_tap_card: { hy: 'Սեղմի՛ր քարտին և լսի՛ր բառը։', translit: 'Seghmir kartin yev lsir bary.', en: 'Tap the card to hear the word!' },
  lesson_find_picture: { hy: 'Գտի՛ր նկարը։', translit: 'Gtir nkary.', en: 'Find the picture!' },
  lesson_good_try: { hy: 'Փորձի՛ր նորից։ Սեղմի՛ր մյուս նկարին։', translit: 'Portsir norits. Seghmir myus nkarin.', en: 'Good try! Tap another picture.' },
  lesson_song: { hy: 'Եկ երգենք։ Սեղմի՛ր տողերին։', translit: 'Yek yergenk. Seghmir toghyerin.', en: "Let's hear our little song! Tap a line." },
  lesson_say_it: { hy: 'Նախ ես, հետո դու։ Ասա՛ բառը բարձրաձայն։', translit: 'Nakh yes, heto du. Asa bary bardzradzayn.', en: 'My turn, then your turn! Say the word aloud.' },
  lesson_done: { hy: 'Ապրե՛ս։ Հիանալի աշխատեցիր։', translit: 'Apres. Hianali ashkhatetsir.', en: 'Amazing work! You did it!' },
  all_caught_up: { hy: 'Այսօրվա համար բավական է։ Վաղը նորից արի։', translit: 'Aysorva hamar bavakan e. Vaghy norits ari.', en: 'All caught up! Come back tomorrow.' },
  free_words_finished: { hy: 'Դու սովորեցիր բոլոր անվճար բառերը։ Ապրե՛ս։', translit: 'Du sovoretsir bolor anvchar baryery. Apres.', en: 'You learned all the free words! 🎉' },
  games_locked: { hy: 'Նախ ավարտի՛ր դասը, և խաղերը կբացվեն։', translit: 'Nakh avartir dasy, yev khaghery kbatsvyen.', en: 'Finish a lesson first to unlock games!' },
  games_done_today: { hy: 'Այսօրվա խաղերը վերջացան։ Մինչև վաղը։', translit: 'Aysorva khaghery vyerjatsan. Minchyev vaghy.', en: "That's all the games for today — see you tomorrow!" },
  game_memory_done: { hy: 'Դու հաղթեցիր {moves} քայլով։', translit: 'Du haghtyetsir {moves} qaylov.', en: 'You did it in {moves} moves!' },
  game_score: { hy: 'Ապրե՛ս։ {score} ճիշտ պատասխան {total}-ից։', translit: 'Apres. {score} chisht pataskhan {total}-its.', en: 'Great job! {score} of {total} right on the first try!' },
  game_listen_prompt: { hy: 'Լսի՛ր և գտի՛ր նկարը։', translit: 'Lsir yev gtir nkary.', en: 'Listen and find the picture!' },
  game_read_prompt: { hy: 'Ո՞ր բառն է սա։', translit: 'Vo՞r barn e sa.', en: 'Which word is this?' },
  game_correct: { hy: 'Ապրե՛ս։', translit: 'Apres.', en: 'Great!' },
  game_try_again: { hy: 'Փորձի՛ր նորից։', translit: 'Portsir norits.', en: 'Try again' },
  tracing_success: { hy: 'Հիանալի է։ Ապրե՛ս։', translit: 'Hianali e. Apres.', en: '⭐ Wonderful tracing!' },
  tracing_retry: { hy: 'Փորձի՛ր նորից։', translit: 'Portsir norits.', en: 'Try once more! Clear and try again.' },
  stickers_empty: { hy: 'Գիրքդ դեռ դատարկ է։ Ավարտի՛ր դասը և կստանաս առաջին կպչուկդ։', translit: 'Girqd der datark e. Avartir dasy yev kstanas arajin kpchukd.', en: 'Your book is empty. Finish a lesson to get your first sticker!' },
} satisfies Record<string, Phrase>;

export type PhraseKey = keyof typeof PHRASES;
