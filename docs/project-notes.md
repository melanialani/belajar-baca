# Project notes — Ayo Baca! (belajar-baca)

## Public URL
- Live app: https://melanialani.github.io/belajar-baca/
- Hosted on GitHub Pages from the repo `melanialani/belajar-baca`. GitHub Pages serves the repo as static files; visiting the URL loads `index.html` from the published branch (assumed `main`, root folder — confirm in repo Settings › Pages).
- Feature branches are not live until they are merged into the published branch and pushed.

## Current structure
Split into static files (2026-10-09); the public URL is unchanged, GitHub Pages serves the extra files next to `index.html`.

```
index.html          ← markup only; links css/app.css, preloads the emoji data, loads js/boot.js
css/app.css
js/boot.js          ← fetches assets/emoji.json, then loads the app scripts below in order
js/helpers.js       ← $, ico/emojify, random, store (ayobaca2:), SET + case helpers, longPress
js/tts.js           ← speech + sound effects
js/words.js         ← word lists, difficulty, learning stages, stickers
js/learn.js         ← navigation, Belajar screens, Belajar → Bermain links
js/parent.js        ← parent mode, report, break timer
js/games.js         ← level engine + all games
js/main.js          ← startup
assets/emoji.json   ← ~6.7 MB Fluent Emoji SVG data
```

- Why a loader: data in words.js/games.js calls `ico()` at load time, so `EMO` must exist before those scripts run (same as the old inline `<script id="emo">`). `helpers.js` reads `window.EMO_DATA`. If the fetch fails, icons fall back to plain emoji characters.
- `body.loading` hides `#app` until `main.js` has run, so no half-built screen is shown while the emoji data downloads.
- Loading speed: the total download is about the same as before (the emoji data is most of it). The gain is that the browser caches each file separately, so a code change no longer forces re-downloading the 6.7 MB emoji data, and the code files are small to edit and review. Further size cuts would mean shrinking/compressing the emoji SVGs or loading them lazily.
- Development needs a local static server (`fetch` does not work from `file://`): port 4006, see `.claude/launch.json`. Saving the page as one file for offline use no longer works.

## Branches
- `claude`: working branch for Claude. Merge into `main` (live) only after the user approves; later changes go back to `claude`.

## History
- 2026-10-08: parent setting "Bentuk huruf" (abc / Abc / ABC) added on branch `feature/letter-case-setting`; default stays lowercase.
- 2026-10-09: split index.html into css/js/assets files (branch `claude`, includes the letter-case setting); behavior verified identical against the single-file version.
