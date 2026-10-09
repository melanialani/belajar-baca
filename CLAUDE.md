# Ayo Baca! (belajar-baca)

Reading-practice web app for Indonesian kindergarten kids. Background, deploy notes and history: [docs/project-notes.md](docs/project-notes.md).

## Stack & structure
- Static files, no build step, no package manager. Classic `<script>` files sharing globals (no modules).
- `index.html` (markup) → `css/app.css` and plain `<script src>` files in order: `js/emoji-index.js, helpers.js, tts.js, words.js, learn.js, parent.js, games.js, main.js`.
- Emoji: one SVG per emoji in `assets/emoji/<hex code points joined by ->.svg`; `EMO` (`js/emoji-index.js`) is the Set of available keys. Always render emoji via `ico()`/`emojify()` (lazy `<img>` with text fallback via `emoFail`); use `preloadEmo()` for icons revealed later. Don't print the SVG files.
- State lives in `localStorage` via `store` (prefix `ayobaca2:`); settings in `SET` (`store` key `set`).

## Branch & deploy
- Work on branch `claude`; merge into `main` only when the user approves. For later changes switch back to `claude` (bring it up to date with `main` first).
- Cache busting: CSS/JS links in `index.html` carry `?v=YYYY-MM-DD`. Bump it on every release that changes CSS/JS (GitHub Pages caches ~10 min; this keeps a new `index.html` from mixing with old JS). Emoji SVGs need no version.
- Public URL: https://melanialani.github.io/belajar-baca/ (GitHub Pages, repo `melanialani/belajar-baca`). Only what is pushed to `main` goes live.

## Rules
- UI text shown to kids/parents is Indonesian (app language); code, comments, identifiers, commits stay English.
- Displayed words/syllables/letters must go through the case helpers (`caseWord`, `casePart`, `caseUnit`) so the parent "Bentuk huruf" setting applies. TTS always gets the raw lowercase data.
- New parent settings: add a `.setrow` in `#parentov`, default in `SET`, persist with `store.set('set',SET)`; reuse the `.seg`/`.tog` patterns.
- Game feedback (all games, via the shared `api.ok()`/`api.bad()` in `nextQ`; new games must use them, no own timers/feedback):
  - Correct: confetti + big random `PRAISE` text + its voice, then go to the next question right after (≈1 s), no long pause.
  - Wrong: big X + random `OOPS` text + its voice, taps blocked ≈0.9 s, one heart lost.
  - `HEARTS` = 5 per level; 0 hearts → `GAMEOVER` text + voice, back to that game's level list, no stars. Stars: 0 wrong 3⭐, 1–2 2⭐, 3–4 1⭐.
  - Every word question must let the child hear the word (🔊 button and/or auto-say), except games where the sound is the answer (Tebak Nama Benda, Puzzle Bacaan Benda).
  - Feedback phrases are written in normal case (TTS-friendly) and shown uppercase via CSS.
- Timers that must survive screen-off (break countdown) use real clock time (`Date.now()` end time), never tick counting.
- Verify: `node --check js/*.js`; test in the browser via the local static server on port **4006** (`.claude/launch.json`, `python -m http.server 4006`).
