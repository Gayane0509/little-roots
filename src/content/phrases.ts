export type Phrase = { hy: string; translit: string; en: string };

/**
 * Child-facing Buddy lines, plus the parent report's talk-together questions (`talk_*`, read aloud by a grown-up).
 * Placeholders: {name} {count} {moves} {score} {total} {word}. `{word}` stays in the dictionary form (no case ending).
 */
export const PHRASES = {
  greeting: { hy: 'Բարև, {name}։', translit: 'Barev, {name}.', en: 'Hello, {name}!' },
  greeting_anon: { hy: 'Բարև։', translit: 'Barev.', en: 'Hello!' },
  onboarding_intro: { hy: 'Բարև։ Ես Արջուկն եմ։', translit: 'Barev. Yes Arjukn em.', en: 'Hi! I am Little Bear.' },
  who_is_learning: { hy: 'Ո՞վ է սովորում։', translit: 'Vo՞v e sovorum.', en: 'Who is learning?' },
  lesson_loading: { hy: 'Մի փոքր սպասիր…', translit: 'Mi pokr spasir…', en: 'Getting your lesson ready…' },
  // Armenian keeps the noun singular after any number; only English needs its own singular line.
  lesson_new_word: { hy: 'Եկ սովորենք {count} նոր բառ։', translit: 'Yek sovorenk {count} nor bar.', en: "Let's learn {count} new word!" },
  lesson_new_words: { hy: 'Եկ սովորենք {count} նոր բառ։', translit: 'Yek sovorenk {count} nor bar.', en: "Let's learn {count} new words!" },
  lesson_practice: { hy: 'Եկ կրկնենք մեր բառերը։', translit: 'Yek krknenk mer barery.', en: "Let's practice our words!" },
  lesson_tap_card: { hy: 'Նայի՛ր նկարին և կարդա՛ բառը։', translit: 'Nayir nkarin yev karda bary.', en: 'Look at the picture and read the word!' },
  lesson_find_picture: { hy: 'Գտի՛ր նկարը։', translit: 'Gtir nkary.', en: 'Find the picture!' },
  // Before a round that reviews a word met on an earlier day (#160), so the child knows it is not a new word.
  lesson_remember_picture: { hy: 'Հիշու՞մ ես։ Գտի՛ր նկարը։', translit: 'Hishu՞m es. Gtir nkary.', en: 'Do you remember? Find the picture!' },
  lesson_good_try: { hy: 'Փորձի՛ր նորից։ Սեղմի՛ր մյուս նկարին։', translit: 'Portsir norits. Seghmir myus nkarin.', en: 'Good try! Tap another picture.' },
  lesson_song: { hy: 'Եկ կարդանք մեր ոտանավորը։ Սեղմի՛ր տողերին։', translit: 'Yek kardank mer votanavory. Seghmir toghyerin.', en: "Let's read our little rhyme! Tap a line." },
  lesson_done: { hy: 'Ապրե՛ս։ Հիանալի աշխատեցիր։', translit: 'Apres. Hianali ashkhatetsir.', en: 'Amazing work! You did it!' },
  all_caught_up: { hy: 'Այսօրվա համար բավական է։ Վաղը նորից արի։', translit: 'Aysorva hamar bavakan e. Vaghy norits ari.', en: 'All caught up! Come back tomorrow.' },
  free_words_finished: { hy: 'Դու սովորեցիր բոլոր անվճար բառերը։ Ապրե՛ս։', translit: 'Du sovoretsir bolor anvchar baryery. Apres.', en: 'You learned all the free words! 🎉' },
  games_locked: { hy: 'Նախ ավարտի՛ր դասը, և խաղերը կբացվեն։', translit: 'Nakh avartir dasy, yev khaghery kbatsvyen.', en: 'Finish a lesson first to unlock games!' },
  games_done_today: { hy: 'Այսօրվա խաղերը վերջացան։ Մինչև վաղը։', translit: 'Aysorva khaghery vyerjatsan. Minchyev vaghy.', en: "That's all the games for today — see you tomorrow!" },
  game_memory_done: { hy: 'Դու հաղթեցիր {moves} քայլով։', translit: 'Du haghtyetsir {moves} qaylov.', en: 'You did it in {moves} moves!' },
  game_score: { hy: 'Ապրե՛ս։ {score} ճիշտ պատասխան {total}-ից։', translit: 'Apres. {score} chisht pataskhan {total}-its.', en: 'Great job! {score} of {total} right on the first try!' },
  game_memory_prompt: { hy: 'Գտի՛ր զույգերը՝ նկարն ու բառը։', translit: 'Gtir zuygery, nkarn u bary.', en: 'Find the pairs: a picture and its word!' },
  game_find_prompt: { hy: 'Կարդա՛ և գտի՛ր նկարը։', translit: 'Karda yev gtir nkary.', en: 'Read the word and find the picture!' },
  game_read_prompt: { hy: 'Ո՞ր բառն է սա։', translit: 'Vo՞r barn e sa.', en: 'Which word is this?' },
  game_count_prompt: { hy: 'Սեղմի՛ր ամեն մեկին և հաշվի՛ր։', translit: 'Seghmir amen mekin yev hashvir.', en: 'Tap each one and count!' },
  game_count_how_many: { hy: 'Քանի՞ հատ կա։', translit: 'Kani hat ka.', en: 'How many are there?' },
  game_sounds_prompt: { hy: 'Ո՞ր նկարն է սկսվում այս տառով։', translit: 'Vor nkarn e sksvum ays tarov.', en: 'Which picture starts with this letter?' },
  game_sounds_locked: { hy: 'Նախ գրի՛ր երեք տառ։', translit: 'Nakh grir yerek tar.', en: 'Trace three letters first!' },
  game_count_locked: { hy: 'Նախ սովորի՛ր թվերը։', translit: 'Nakh sovorir tvery.', en: 'Learn the Numbers words first!' },
  game_correct: { hy: 'Ապրե՛ս։', translit: 'Apres.', en: 'Great!' },
  game_try_again: { hy: 'Փորձի՛ր նորից։', translit: 'Portsir norits.', en: 'Try again' },
  tracing_success: { hy: 'Հիանալի է։ Ապրե՛ս։', translit: 'Hianali e. Apres.', en: '⭐ Wonderful tracing!' },
  tracing_retry: { hy: 'Փորձի՛ր նորից։', translit: 'Portsir norits.', en: 'Try once more! Clear and try again.' },
  stickers_empty: { hy: 'Գիրքդ դեռ դատարկ է։ Ավարտի՛ր դասը և կստանաս առաջին կպչուկդ։', translit: 'Girqd der datark e. Avartir dasy yev kstanas arajin kpchukd.', en: 'Your book is empty. Finish a lesson to get your first sticker!' },
  talk_show_me: { hy: 'Ցույց տո՛ւր՝ {word}։', translit: 'Tsuyts tur, {word}.', en: 'Show me: {word}!' },
  talk_is_this: { hy: 'Սա {word} է՞։', translit: 'Sa {word} e?', en: 'Is this the {word}?' },
  talk_say_with_me: { hy: 'Ասա՛ ինձ հետ՝ {word}։', translit: 'Asa indz het, {word}.', en: 'Say it with me: {word}!' },
} satisfies Record<string, Phrase>;

export type PhraseKey = keyof typeof PHRASES;
