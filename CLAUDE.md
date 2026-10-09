# Ayo Baca! (belajar-baca)

Reading-practice web app for Indonesian kindergarten kids. Background, deploy notes and history: [docs/project-notes.md](docs/project-notes.md).

## Stack & structure
- Static files, no build step, no package manager. Classic `<script>` files sharing globals (no modules).
- `index.html` (markup) → `css/app.css`, `js/boot.js`. `boot.js` fetches `assets/emoji.json`, then loads `js/helpers.js, tts.js, words.js, learn.js, parent.js, games.js, main.js` in that order (`APP_JS`). New JS files go into `APP_JS`, not `index.html`.
- `assets/emoji.json` is ~6.7 MB of Fluent Emoji SVGs on one line. Never Read/print it.
- App code builds icons at load time (`ems()`/`ico()` in data), so `EMO` must be loaded before app scripts run; keep that order.
- State lives in `localStorage` via `store` (prefix `ayobaca2:`); settings in `SET` (`store` key `set`).

## Branch & deploy
- Work on branch `claude`; merge into `main` only when the user approves. For later changes switch back to `claude` (bring it up to date with `main` first).
- Public URL: https://melanialani.github.io/belajar-baca/ (GitHub Pages, repo `melanialani/belajar-baca`). Only what is pushed to `main` goes live.

## Rules
- UI text shown to kids/parents is Indonesian (app language); code, comments, identifiers, commits stay English.
- Displayed words/syllables/letters must go through the case helpers (`caseWord`, `casePart`, `caseUnit`) so the parent "Bentuk huruf" setting applies. TTS always gets the raw lowercase data.
- New parent settings: add a `.setrow` in `#parentov`, default in `SET`, persist with `store.set('set',SET)`; reuse the `.seg`/`.tog` patterns.
- Verify: `node --check js/*.js`; test in the browser via the local static server on port **4006** (`.claude/launch.json`, `python -m http.server 4006`). `file://` does not work (fetch).
