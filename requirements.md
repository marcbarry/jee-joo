# Jizhu / jee-joo (from 记住, "to remember") — Requirements

- Mobile-first flashcard app for learning Chinese.
- Decks loaded by URL. A default deck is pre-linked as placeholder text in the URL input; the user can override with any deck URL.
- No backend. Static site, served from GitHub Pages.
- Tailwind CSS via CDN.
- localStorage for all state, scoped per deck, with the deck's URL as the unique key.
- Using the flashcards to study hanzi will be elective, the user may or may not choose to use / include / show them (toggle-based).
- The deck stores pinyin only and pronunciation hints are an app concern. Mandarin has a finite syllable inventory — about 400 distinct syllables (initial + final), 1,300 if you count tones. The mapping from pinyin to "what an English speaker should read to approximate it" is small and stable: `xuě` always sounds the same, so its approximation is always `shweh`. Once you have the lookup table (or a small set of initial/final rewrite rules), the function is just `pinyin → approx` and you're done. It's a deterministic function, not in the deck file.
- Pattern cards must render one selected slot as a blank, show the selected slot item's English gloss as the clue, offer answer options from the same vocabulary group using the learner's hanzi/pinyin display settings, reveal the fully rendered sentence after answering, and track SRS progress against the pattern card rather than each slot expansion.

## SRS

- Per-deck localStorage record mapping `card.id` → `{ ease, interval, dueAt, lastReviewedAt, reps, lapses }`, updated on each self-grade via a small SM-2-style algorithm that picks the next-due card at review time.
- New-card introduction is rate-limited by a **global** (app-wide, not per-deck) daily cap configurable by the user, so a freshly opened deck doesn't surface all its cards at once.
- The localStorage record carries a `version` field so future changes to the SRS algorithm or schema can migrate existing learner state without resetting progress.
- Deck-change tolerance is implicit, not coded: lookups are by `(deck URL, card.id)`, so cards added to a deck between visits naturally enter the new-card queue, and ids removed from the deck simply stop being looked up. No special handling required; orphan pruning is a later size optimization, not a correctness concern.
- Pattern cards remember the last infill shown so consecutive reviews of the same pattern card pick a different slot item, preventing the learner from memorizing one fixed string instead of the pattern.
- Self-grade scale uses Anki's **Again / Hard / Good / Easy** buttons; the SM-2 update function consumes that scale.
