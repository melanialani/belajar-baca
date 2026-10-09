# Ayo Baca! (belajar-baca)

Reading-practice web app for Indonesian kindergarten kids. Background, deploy notes and history: [docs/project-notes.md](docs/project-notes.md).

## Stack & structure
- Static files, no build step, no package manager. Classic `<script>` files sharing globals (no modules).
- `index.html` (markup) → `css/app.css` and plain `<script src>` files in order: `js/emoji-index.js, helpers.js, tts.js, words.js, learn.js, parent.js, games.js, main.js`.
- Emoji: one SVG per emoji in `assets/emoji/<hex code points joined by ->.svg`; `EMO` (`js/emoji-index.js`) is the Set of available keys. Always render emoji via `ico()`/`emojify()` (lazy `<img>` with text fallback via `emoFail`); use `preloadEmo()` for icons revealed later. Don't print the SVG files.
- State lives in `localStorage` via `store` (prefix `ayobaca2:`); settings in `SET` (`store` key `set`).

## Branch & deploy
- Work on branch `claude`; merge into `main` only when the user approves. For later changes switch back to `claude` (bring it up to date with `main` first).
- Public URL: https://melanialani.github.io/belajar-baca/ (GitHub Pages, repo `melanialani/belajar-baca`). Only what is pushed to `main` goes live.

## Rules
- UI text shown to kids/parents is Indonesian (app language); code, comments, identifiers, commits stay English.
- Displayed words/syllables/letters must go through the case helpers (`caseWord`, `casePart`, `caseUnit`) so the parent "Bentuk huruf" setting applies. TTS always gets the raw lowercase data.
- New parent settings: add a `.setrow` in `#parentov`, default in `SET`, persist with `store.set('set',SET)`; reuse the `.seg`/`.tog` patterns.
- Verify: `node --check js/*.js`; test in the browser via the local static server on port **4006** (`.claude/launch.json`, `python -m http.server 4006`).
