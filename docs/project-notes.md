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
js/count-games.js   ← Kasih Makan Hewan, Kilat Titik, Toko Buah
js/memory.js        ← memoryGame() + Kartu Memori (words) / Kartu Memori Angka
js/number-games.js  ← Urutkan Balon, Buaya Lapar, Susun Angka, Bangun Angka, Teman Sepuluh, Lompat Katak
js/science-data.js  ← science topics per category (question, pictures, sentences), Kuis Sains questions, Benar atau Salah facts
js/science.js       ← Sains: Warna/Hewan/Buah/Sayur stages, science category stages, Kuis Sains, Benar atau Salah (+ shapes/patterns pushed in by shapes.js)
js/shapes.js        ← Bentuk & Pola: learn stages + Tebak Bentuk, Hitung Bentuk, Lanjutkan Pola
js/daily.js         ← Latihan Hari Ini (10 mixed questions, streak)
js/main.js          ← builds ALLGAMES, startup
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
- 2026-10-09: game feedback reworked for all games: big praise + confetti then next question at once, big X on wrong, 5 hearts per level (0 → back to level list). Lengkapi Kata now says the word (+🔊 button).
- 2026-10-09: break reminder fixed: 2-minute countdown uses real time (finishes while the screen is off), screen-off time no longer counts as screen time. Default reminder 15 → 30 min; saved 15 moved to 30 once (`SET.brkMig` marks it done).
- 2026-10-09: CSS/JS links versioned with `?v=2026-10-09` so parents get matching new files without a hard refresh (GitHub Pages cache is ~10 min).
- 2026-10-12: new home menu "Berhitung" (🧮): learn stages Angka 1–10, Angka 11–20, Penjumlahan, Pengurangan + 7 games (Hitung Benda, Tebak Suara Angka, Mana Lebih Banyak, Angka Hilang, Penjumlahan, Pengurangan, Sambung Angka), 25 levels each, stars count toward stickers. Asset version `?v=2026-10-12b` (second release that day).
- 2026-10-12: 11 more games + daily practice. Bermain: Parade Kata, Kereta Bunyi (blending), Tepuk Suku Kata, Kalimat Pendek, Kartu Memori, Baca Keras (speech recognition; hidden on browsers without it). Berhitung: Parade Angka, Kasih Makan Hewan, Kilat Titik, Toko Buah, Kartu Memori Angka. Home: "Latihan Hari Ini" (10 questions mixing reading/counting at the child's level, review words first; streak 🔥 in `store` key `daily`, no stars). Exceptions to the feedback rule, on purpose: Kartu Memori only costs a heart when the partner card was already seen; Baca Keras only counts every third misheard attempt (recognizer is unreliable). Asset version `?v=2026-10-12c`.
- 2026-10-12: home split into four menus: Belajar Baca, Game Baca, Belajar Hitung (`#belhitung`, `MATH_STAGES`), Game Hitung (`#mainhitung`, `MATH_GAMES`); Stiker as a tall side button (full-width row on portrait). Counting content gets its back target (`home`) in `main.js`. Asset version `?v=2026-10-12d`.
- 2026-10-12: counting curriculum from zero to 100. Number words 0–100 (`numW`). Belajar Hitung now 17 stages: Angka 1–5, 6–10 & 0, Banyak & Sedikit, Belasan 11–19 ("dua belas = sepuluh dan dua"), Puluhan 10–100, Cara Baca Angka (2 · 12 · 20 · 22), Angka 21–50, 51–100 (tens rods + cubes, read as "dua puluh, dan dua"), Tambah/Kurang sampai 5 and 10, Teman Sepuluh, Hitung sampai 20, Tambah Kurang Puluhan, Bentuk, Pola (stage ids m1–m4 kept for saved progress). Existing counting games now step up every level up to 100 (look-alike choices like 12/21/20/22 later). 9 new games: Urutkan Balon, Buaya Lapar, Susun Angka, Bangun Angka, Teman Sepuluh, Lompat Katak, Tebak Bentuk, Hitung Bentuk, Lanjutkan Pola (all in Latihan Hari Ini except Bangun Angka). Toko Buah gets a 10 coin in the last band. Fixed: crossed-out pictures used the class `.x` (overlay close button style) and showed as 60px circles; now `.cx`. Asset version `?v=2026-10-12e`.
- 2026-10-12: cards in every menu ordered easy → hard (one list per menu in `main.js`). New home menu "Kenali Dunia" 🌈 (`#dunia`): Warna, Bentuk, Hewan, Buah, Sayur, Pola + Tebak Bentuk, Hitung Bentuk, Lanjutkan Pola, moved out of Belajar Baca / Belajar Hitung / Game Hitung (stage ids k2–k5 kept). Huruf A–Z is now a normal Belajar Baca stage (3rd); the "kamus" card style is gone. Asset version `?v=2026-10-12f`.
- 2026-10-12: navigation reworked: Home has Belajar, Main, Stiker; Belajar and Main each open Baca · Hitung · Sains (the Kenali Dunia menu became Sains). Sains learn: Warna, Bentuk, Hewan, Buah, Sayur, Tubuh Kita, Sains Hewan, Pola, Tumbuhan, Air & Benda, Cuaca & Alam, Langit & Antariksa (44 science topics, each a question + pictures + sentences read one by one). Sains games: Tebak Bentuk, Kuis Sains, Hitung Bentuk, Lanjutkan Pola, Benar atau Salah. 🧲 has no SVG and shows the device emoji. Asset version `?v=2026-10-12g`.
- 2026-10-12: css/app.css split into 8 feature files and js/games.js into engine.js + reading-games.js. Rule order kept per file; checked that every element's computed style is identical before/after (192 screens/games, 10,168 elements, desktop + phone landscape + phone portrait). Asset version `?v=2026-10-12h`.
