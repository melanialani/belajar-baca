# Project notes — Ayo Baca! (belajar-baca)

## Public URL
- Live app: https://melanialani.github.io/belajar-baca/
- Hosted on GitHub Pages from the repo `melanialani/belajar-baca`. GitHub Pages serves the repo as static files; visiting the URL loads `index.html` from the published branch (assumed `main`, root folder — confirm in repo Settings › Pages).
- Feature branches are not live until they are merged into the published branch and pushed.

## Current structure
Split into static files (2026-10-09); the public URL is unchanged, GitHub Pages serves the extra files next to `index.html`.

```
index.html          ← markup only; links the CSS files and the scripts below (plain <script src>, in order)
css/base.css        ← design tokens, page, screens, top bar, shared panels, animations
css/home.css        ← home, Belajar / Main hubs, card lists, level grid, stickers
css/learn.css       ← learn viewer
css/game.css        ← game screen: questions, answers, tiles, matching, feedback, end panel
css/parent.css      ← parent mode, report, break reminder
css/reading-games.css ← parade, blending train, drum, sentences, read aloud, word search, memory cards
css/math.css        ← numbers, pictures, ten frames, blocks, counting games
css/science.css     ← shapes, patterns, science topics, true/false
css/experiments.css ← experiment pages
css/safety.css      ← Jaga Diri badges, number cards, parent inputs
js/emoji-index.js   ← EMO: Set of emoji that have an SVG file
js/helpers.js       ← $, ico/emojify/preloadEmo, random, store (ayobaca2:), SET + case helpers, longPress
js/tts.js           ← speech + sound effects
js/words.js         ← word lists, difficulty, learning stages, stickers
js/learn.js         ← navigation, Belajar screens, Belajar → Bermain links
js/parent.js        ← parent mode, report, break timer
js/engine.js        ← level engine (levels, hearts, feedback) + shared patterns arrange() / matchGame()
js/reading-games.js ← word / syllable pickers + the Game Baca list
js/math.js          ← counting core: numW (0–100), objects / ten frames / blocks, level ladders, first counting games
js/math-learn.js    ← Belajar Hitung stages (1–5 … sums with tens)
js/parade.js        ← parade() (answers on flags over looping vehicles) + Parade Kata / Parade Angka
js/phonics.js       ← Kereta Bunyi, Tepuk Suku Kata, Kalimat Pendek, Baca Keras (mic, only if supported)
js/count-games.js   ← Kasih Makan Hewan, Kilat Titik, Ayo Belanja (was Toko Buah)
js/memory.js        ← memoryGame() + Kartu Memori (words) / Kartu Memori Angka
js/number-games.js  ← Urutkan Balon, Buaya Lapar, Susun Angka, Bangun Angka, Teman Sepuluh, Lompat Katak
js/science-data.js  ← science topics per category (question, pictures, sentences), Kuis Sains questions, Benar atau Salah facts
js/data/sains-*.js  ← one science category each (hewan, tubuh, tumbuhan, benda, alam, langit): 100 topics in 6–7 smaller cards + quiz / true-false items
js/data/fakta-1.js, fakta-2.js ← 500 Tahukah Kamu? facts in 8 cards
js/facts.js         ← Tahukah Kamu? group card
js/data/eksperimen.js, eksperimen-2.js, eksperimen-3.js ← 300 experiments in 16 themes
js/experiments.js   ← Eksperimen cards (materials, steps, what happens, why; page scrolls to the line being read)
js/data/jaga-diri.js ← Jaga Diri content: rule cards, important numbers, Aman atau Bahaya? situations, Telepon Siapa? questions
js/safety.js        ← Jaga Diri screen, number cards, family phone/address cards, two games
tools/emoji_tool.py ← exports Fluent Emoji SVGs by code point (see its header)
js/science.js       ← Sains: Warna/Hewan/Buah/Sayur stages, science category stages, Kuis Sains, Benar atau Salah (+ shapes/patterns pushed in by shapes.js)
js/shapes.js        ← Bentuk & Pola: learn stages + Tebak Bentuk, Hitung Bentuk, Lanjutkan Pola
js/daily.js         ← Latihan Hari Ini (10 mixed questions, streak)
js/profiles.js      ← child profiles (switch, add, rename, delete), "Siapa yang main?" (child + Main sendiri / Didampingi) + Mode Balita switch
js/ui.js            ← theme (auto/light/dark), Mode Didampingi, subtitles (TTS.onCap), today summary, Panduan Suara (steps per phone brand + troubleshooting)
js/data/tulis.js    ← stroke paths of a–z, A–Z, 0–9 for tracing
js/writing.js       ← tracePad() (finger tracing), Menulis learn cards, Tulis Huruf + Dikte games
js/data/cerita.js   ← 40 picture stories (5 levels) with questions
js/data/dongeng-putri.js, dongeng-dunia.js, dongeng-dunia2.js, dongeng-nusantara.js ← bilingual tales (Indonesian + English) for the Buku Cerita menu
js/stories.js       ← Buku Cerita (read-along, word highlight) + Baca Cerita game
js/math-sd.js       ← SD counting: Perkalian, Pembagian, Ratusan & Ribuan, Jam, Uang, Pecahan (learn + games)
js/english.js       ← English words (learn cards) + 4 games, English voice
js/voice.js         ← parent voice recordings (IndexedDB), mic button on learn pages
js/placement.js     ← Tes Awal (adaptive placement, "Mulai di sini" card)
js/worksheet.js     ← printable worksheet + "soal yang akan diulang" report
js/data/perasaan.js ← Perasaanku cards + Tebak Perasaan situations
js/data/kuis-tambahan.js ← extra Kuis Sains, Benar atau Salah, Aman atau Bahaya, Telepon Siapa questions
js/toddler.js       ← Si Kecil: Suara Hewan, Cilukba, Piano Warna, Pecah Gelembung
js/main.js          ← builds ALLGAMES, startup, service worker registration
sw.js, manifest.webmanifest, assets/icons/ ← installable app, works offline (app files precached, emoji cached in the background)
tools/playtest.js   ← automated play-through of every game (see its header)
assets/emoji/*.svg  ← 488 Fluent Emoji SVGs, one file each (name = hex code points joined by "-")
```

- Emoji are loaded per image (2026-10-09): `ico()` returns `<img src="assets/emoji/….svg">`, so the browser downloads only the icons on screen (home ≈ 26 small files instead of one 6.7 MB JSON, ~770 KB gzipped). Each file is cached separately.
- Risks handled: if an SVG fails to load (offline, missing file) `emoFail` swaps it for the plain emoji character; `.emo` has a fixed 1em size so late images don't shift the layout; `preloadEmo()` fetches icons that appear later (next Belajar item, the hidden answer picture in Tebak Suara Nama Benda) so they show without delay.
- No fetch at startup any more, so the app also opens from `file://`; the local static server (port 4006, `.claude/launch.json`) is still the normal way to test.

## Branches
- `claude`: working branch for Claude. Merge into `main` (live) only after the user approves; later changes go back to `claude`.

## History
- 2026-10-08: parent setting "Bentuk huruf" (abc / Abc / ABC) added on branch `feature/letter-case-setting`; default stays lowercase.
- 2026-10-09: split index.html into css/js/assets files (branch `claude`, includes the letter-case setting); behavior verified identical against the single-file version.
- 2026-10-09: emoji moved from one JSON to one SVG file per emoji, loaded on demand.
- 2026-10-29: redesign (branch `claude-2njqzj`): new palette and design tokens, light/dark theme, soft shadows instead of 3D blocks, new home (child chip, greeting, tiles, daily banner), tinted cards and level tiles, grouped settings, Mode Didampingi, subtitles, Panduan Suara. Mockup: https://claude.ai/artifact/8bxYrwb9MkHjEGWKASWzmw. Voice steps checked against Xiaomi, Samsung and realme support pages (Oct 2026); vivo/OPPO paths vary, so the guide tells parents to search "text-to-speech" in Settings.
- 2026-10-09: game feedback reworked for all games: big praise + confetti then next question at once, big X on wrong, 5 hearts per level (0 → back to level list). Lengkapi Kata now says the word (+🔊 button).
- 2026-10-09: break reminder fixed: 2-minute countdown uses real time (finishes while the screen is off), screen-off time no longer counts as screen time. Default reminder 15 → 30 min; saved 15 moved to 30 once (`SET.brkMig` marks it done).
- 2026-10-09: CSS/JS links versioned with `?v=2026-10-09` so parents get matching new files without a hard refresh (GitHub Pages cache is ~10 min).
- 2026-10-12: new home menu "Berhitung" (🧮): learn stages Angka 1–10, Angka 11–20, Penjumlahan, Pengurangan + 7 games (Hitung Benda, Tebak Suara Angka, Mana Lebih Banyak, Angka Hilang, Penjumlahan, Pengurangan, Sambung Angka), 25 levels each, stars count toward stickers. Asset version `?v=2026-10-12b` (second release that day).
- 2026-10-12: 11 more games + daily practice. Bermain: Parade Kata, Kereta Bunyi (blending), Tepuk Suku Kata, Kalimat Pendek, Kartu Memori, Baca Keras (speech recognition; hidden on browsers without it). Berhitung: Parade Angka, Kasih Makan Hewan, Kilat Titik, Ayo Belanja (was Toko Buah), Kartu Memori Angka. Home: "Latihan Hari Ini" (10 questions mixing reading/counting at the child's level, review words first; streak 🔥 in `store` key `daily`, no stars). Exceptions to the feedback rule, on purpose: Kartu Memori only costs a heart when the partner card was already seen; Baca Keras only counts every third misheard attempt (recognizer is unreliable). Asset version `?v=2026-10-12c`.
- 2026-10-12: home split into four menus: Belajar Baca, Game Baca, Belajar Hitung (`#belhitung`, `MATH_STAGES`), Game Hitung (`#mainhitung`, `MATH_GAMES`); Stiker as a tall side button (full-width row on portrait). Counting content gets its back target (`home`) in `main.js`. Asset version `?v=2026-10-12d`.
- 2026-10-12: counting curriculum from zero to 100. Number words 0–100 (`numW`). Belajar Hitung now 17 stages: Angka 1–5, 6–10 & 0, Banyak & Sedikit, Belasan 11–19 ("dua belas = sepuluh dan dua"), Puluhan 10–100, Cara Baca Angka (2 · 12 · 20 · 22), Angka 21–50, 51–100 (tens rods + cubes, read as "dua puluh, dan dua"), Tambah/Kurang sampai 5 and 10, Teman Sepuluh, Hitung sampai 20, Tambah Kurang Puluhan, Bentuk, Pola (stage ids m1–m4 kept for saved progress). Existing counting games now step up every level up to 100 (look-alike choices like 12/21/20/22 later). 9 new games: Urutkan Balon, Buaya Lapar, Susun Angka, Bangun Angka, Teman Sepuluh, Lompat Katak, Tebak Bentuk, Hitung Bentuk, Lanjutkan Pola (all in Latihan Hari Ini except Bangun Angka). Toko Buah gets a 10 coin in the last band. Fixed: crossed-out pictures used the class `.x` (overlay close button style) and showed as 60px circles; now `.cx`. Asset version `?v=2026-10-12e`.
- 2026-10-12: cards in every menu ordered easy → hard (one list per menu in `main.js`). New home menu "Kenali Dunia" 🌈 (`#dunia`): Warna, Bentuk, Hewan, Buah, Sayur, Pola + Tebak Bentuk, Hitung Bentuk, Lanjutkan Pola, moved out of Belajar Baca / Belajar Hitung / Game Hitung (stage ids k2–k5 kept). Huruf A–Z is now a normal Belajar Baca stage (3rd); the "kamus" card style is gone. Asset version `?v=2026-10-12f`.
- 2026-10-12: navigation reworked: Home has Belajar, Main, Stiker; Belajar and Main each open Baca · Hitung · Sains (the Kenali Dunia menu became Sains). Sains learn: Warna, Bentuk, Hewan, Buah, Sayur, Tubuh Kita, Sains Hewan, Pola, Tumbuhan, Air & Benda, Cuaca & Alam, Langit & Antariksa (44 science topics, each a question + pictures + sentences read one by one). Sains games: Tebak Bentuk, Kuis Sains, Hitung Bentuk, Lanjutkan Pola, Benar atau Salah. 🧲 has no SVG and shows the device emoji. Asset version `?v=2026-10-12g`.
- 2026-10-12: css/app.css split into 8 feature files and js/games.js into engine.js + reading-games.js. Rule order kept per file; checked that every element's computed style is identical before/after (192 screens/games, 10,168 elements, desktop + phone landscape + phone portrait). Asset version `?v=2026-10-12h`.
- 2026-10-12: Belajar hub gets a 4th button Eksperimen (100 safe experiments for TK/SD in 8 themes, each marked "Bersama orang tua"). Sains categories can now be split into smaller cards: Sains Hewan = 100 topics in 6 cards (Hewan di Rumah, Hewan Ternak, Serangga & Hewan Kecil, Burung, Hewan Laut, Hewan Liar); old stage id `sc-hewan` is now the group card. Emoji set grown 488 → 549 from the same Fluent Emoji art (Iconify `@iconify-json/fluent-emoji` 1.2.7, mapped to code points with emojibase labels; 1,563 icons available). Earlier picture substitutions (🌋, moon phases, 🪥, 🧲 …) restored. Plan: the other 5 science categories get 100 topics each, one at a time after review. Asset version `?v=2026-10-12i`.
- 2026-10-13: Sains grown to 600 topics: Tubuh Kita, Sains Hewan, Tumbuhan, Air & Benda, Cuaca & Alam, Langit & Antariksa each 100 topics in 6–7 smaller cards. New Sains card "Tahukah Kamu?" with 500 short facts in 8 cards (Hewan, Laut, Dinosaurus, Tumbuhan, Tubuh, Bumi & Cuaca, Antariksa, Benda & Penemuan). Eksperimen grown to 300 in 16 themes (new: Tanah & Batu, Tubuh Kita, Gerak & Gaya, Larut & Campuran, Panas & Dingin, Cuaca, Hewan Kecil & Pengamatan, Mainan Sains). Kuis Sains 72 questions, Benar atau Salah 73 statements. Emoji 691 SVGs. Learn pages taller than the screen now scroll. Asset version `?v=2026-10-13a`.
- Content rules for science / facts / experiments: Bahasa Indonesia for kids, numbers written as words (TTS), no digits, symbols, parentheses or emoji inside sentences; uncertain science says "para ilmuwan menduga"; experiments: no fire, sharp tools, hot water or strong chemicals handled by the child (parent does it, written "dipakai/dilakukan orang tua"), every experiment shows "Bersama orang tua".
- 2026-10-13: new home button Jaga Diri 🛡️ (home: Belajar, Main, Jaga Diri, Stiker). Cards: Tubuhku Milikku (body safety: private parts, no undressing games, no bad secrets, say no, go, tell; never your fault), Berani Bilang Tidak (dangerous dares), Orang Asing (do not go along, shout "Tolong! Ini bukan ayah atau ibu saya!", family password, door, internet), Kalau Tersesat, Aman di Rumah & Jalan, Nomor Penting (112 darurat, 110 polisi, 113 pemadam, 119 ambulans, 129 SAPA; read digit by digit). Games: Aman atau Bahaya? (36 situations), Telepon Siapa? (112 is never a wrong choice). Mode Orang Tua: optional parent phone number and home address (SET.ph / SET.addr, this device only) shown and read in Nomor Penting for practice. Asset version `?v=2026-10-13b`.
- 2026-10-13: full content review (7 reviewers: reading words, 6 science files, facts, experiments, Jaga Diri + UI text) and fixes. Must-fix items fixed: gelas picture (was a liquor glass), kembar picture (👯), "adik/kakak minum kopi", experiment magnets (now large magnets, put away by the parent), effervescent tablets (parent handles, "bukan permen"), tadpoles (parent fetches, child stays away from water, hand washing, feeding), tsunami advice (strong quake at the beach = go to high ground at once). Also: penyihir, lipstik, 🔮 sticker, 🎃 removed; abstract words lost misleading pictures; ha-us/ka-us/sa-us split per KBBI; myths fixed (morning sun vitamin D, flowers hold honey, koala eats kayu putih, keys stick to magnets, kangaroo not in Indonesia); Jaga Diri softened for children who already had a bad experience, getting-lost steps made consistent, Telepon Siapa never marks a defensible number wrong; stage titles with digits or "&" get a spoken `say`; experiments speak "Lakukan bersama orang tua, ya."; Toko Buah renamed Ayo Belanja; custom #ketupat picture. Asset version `?v=2026-10-13c`.
- 2026-10-21: big update after the parent's observation that KB/TK children tap every option until one fits (branch `claude-2njqzj`, PR #1).
  - Wrong answer: heart lost, the right answer is shown and spoken, then a new question; the missed question returns in later levels until answered right twice (words: `MISS`, other games: redo list). Kartu Memori, Baca Keras and Tulis Huruf keep their board.
  - 100 levels per game (pages of 25); levels 1–25 unchanged (checked: same first question per level, except four games whose question pools grew), 26–100 harder (word tiers 14–18, numbers to 9 999, carrying/borrowing, more choices, more questions). Level grid shows the last try's stars, totals use the best.
  - 300 stickers in albums of 50 (first 100 thresholds unchanged). +100 quiz, +100 true/false, +38 safety situations, +12 phone questions.
  - Child profiles (up to 6), Mode Balita, Si Kecil toddler games, installable/offline app.
  - Tulis Huruf (finger tracing with stroke order) and Dikte; Buku Cerita (40 read-along stories) and Baca Cerita (comprehension); Perasaanku + Tebak Perasaan.
  - SD counting: multiplication, division, place value, clock (Indonesian time words), rupiah, fractions.
  - English (8 word cards, 4 games), parent voice recordings, Tes Awal placement, "soal yang akan diulang" report, printable worksheet.
  - Verified with an automated play-through (every game at levels 1–100 ends with 3 stars, no single/duplicate options, no page errors), every learn page rendered, offline reload, profile isolation, recording with a fake microphone. Asset version `?v=2026-10-21a`.
