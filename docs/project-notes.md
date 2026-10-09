# Project notes — Ayo Baca! (belajar-baca)

## Public URL
- Live app: https://melanialani.github.io/belajar-baca/
- Hosted on GitHub Pages from the repo `melanialani/belajar-baca`. GitHub Pages serves the repo as static files; visiting the URL loads `index.html` from the published branch (assumed `main`, root folder — confirm in repo Settings › Pages).
- Feature branches are not live until they are merged into the published branch and pushed.

## Current structure
Split into static files (2026-10-09); the public URL is unchanged, GitHub Pages serves the extra files next to `index.html`.

```
index.html          ← markup only; links css/app.css and the scripts below (plain <script src>, in order)
css/app.css
js/emoji-index.js   ← EMO: Set of emoji that have an SVG file
js/helpers.js       ← $, ico/emojify/preloadEmo, random, store (ayobaca2:), SET + case helpers, longPress
js/tts.js           ← speech + sound effects
js/words.js         ← word lists, difficulty, learning stages, stickers
js/learn.js         ← navigation, Belajar screens, Belajar → Bermain links
js/parent.js        ← parent mode, report, break timer
js/games.js         ← level engine + all games
js/main.js          ← startup
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
