# Deck Draft — Jizhu Starter

A first deck for Jizhu, drawn from `hsk-1.md` and `first-trip-china.md`. English-only planning doc — this is the shape and content we'd hand to whoever (or whatever) writes the actual JSON.

## Working title

**Jizhu Starter — HSK 1 Foundations + First Trip to China**

Two halves that reinforce each other: the HSK 1 building blocks (pronouns, numbers, question words, core verbs, particles) come first so that by the time the learner hits the practical "First Trip" units, the phrases are intelligible rather than memorized as opaque strings.

## Design principles

1. **Coherent over comprehensive.** Better to ship a tight deck a learner can finish than a complete HSK-1 dump.
2. **Earnable wins early.** Greetings and polite responses up front — within minutes of opening the app a learner can say something real.
3. **Foundations before scenarios.** Pronouns, numbers, question words, and a handful of verbs are prerequisites for nearly every phrase in the first-trip material; they're sequenced first.
4. **Single words and phrases mix freely.** Both are cards; both have `tokens[]`. A single-word card just has one token.
5. **Keep token decomposition meaningful.** Tokens split at word boundaries (e.g. `喜欢` is one token), not per-character, so glosses stay learnable.

## What's in

### Unit 1 — Greetings & Politeness

The quickest wins. Mostly fixed phrases.

- Hello.
- Hello (on the phone).
- Goodbye.
- See you tomorrow.
- Thank you.
- You're welcome.
- Sorry.
- It's nothing. / No problem.
- Please come in.
- Please sit down.

### Unit 2 — People & Pronouns

Foundational. Single-word cards.

- I / me
- you (singular)
- he / him
- she / her
- we / us
- you (plural)
- they (mixed or masculine)
- they (feminine)
- this
- that
- friend
- name
- What is your name?
- My name is ___.

### Unit 3 — Numbers & Time

Numbers 0–10 plus the handful of time words the learner will actually use day one.

- zero, one, two, three, four, five, six, seven, eight, nine, ten
- now
- later
- soon
- earlier
- today
- tomorrow
- yesterday
- when?
- What time is it?
- It's still early.
- It's getting late.

### Unit 4 — Asking Questions

The interrogatives. Single-word cards plus a couple of complete questions to anchor them.

- who
- what
- where
- which
- how
- how about?
- how many (small)
- how much / how many
- How much is this?
- Where is ___?

### Unit 5 — Essential Verbs

The verbs that show up everywhere in the first-trip material.

- to be
- to have / there is
- to be at / in
- to want / would like
- to like
- to go
- to come
- to eat
- to drink
- to look / watch
- to listen
- to speak
- to understand (会)
- to know / recognize
- to be able to (learned)
- to be able to (capability)
- not
- not (with "have")
- also
- very
- a little

### Unit 6 — At the Restaurant

The core ordering scenario. Phrases lifted from first-trip with a few drilled-down patterns.

- It's difficult to choose.
- Sorry, I'm thinking slowly.
- I don't know what to order yet.
- I'm not sure what I want yet.
- Please can I have ___.
- I'd like something with rice.
- I'd like something with noodles.
- I'd like something with vegetables.
- Lots of vegetables, please.
- Not too spicy, please.
- Is this spicy?
- I don't eat meat.
- I don't want this.
- I don't want that.
- Can you recommend something?
- The same as theirs, please.
- One more, please.
- The bill, please.
- Can I pay by phone?

### Unit 7 — At the Table

Reacting to food. Short, high-emotional-payoff phrases.

- It smells delicious.
- It looks delicious.
- It's delicious.
- Delicious!
- Very good.
- I'm full, thank you.
- A little more, please.
- Cheers!

### Unit 8 — Food Vocabulary

A focused subset — not the full first-trip list. The most common items a learner will see on a menu or hear a host say.

Vegetables: bok choy, Chinese cabbage, spinach, broccoli, carrot, potato, tomato, cucumber, eggplant, garlic, ginger, spring onion, mushroom, tofu, bean sprouts, chili pepper.

Meat & seafood: pork, beef, chicken, duck, fish, shrimp, egg.

Staples: rice, noodles, dumplings, steamed bun, soup.

Seasonings: soy sauce, vinegar, chili oil, salt, sugar.

### Unit 9 — Polite Social Responses

The "interacting with friends and their families" half of first-trip.

- No, thank you.
- Yes please, I appreciate that.
- Thank you, you're very kind.
- Great.
- Good.
- That's fine.
- I will work hard.
- I don't really smoke.
- I don't really drink.
- Just a little, please.

### Unit 10 — Getting Around

Directions and the survival phrases for being out in a city.

- left
- right
- straight ahead
- turn around / go back
- here
- there
- How far is it?
- How long does it take?
- Is it walkable?
- Can you show me on the map?
- I'm lost.
- Where is the bathroom?
- Where is the subway?

### Unit 11 — Getting By

Phrases for when the conversation outpaces the learner.

- It's difficult.
- I don't understand.
- Please say it again.
- Please speak more slowly.
- A little.
- I'm still learning.
- How do you say this in Chinese?
- What does this mean?

## What's out (for now)

Deliberately deferred so v1 stays focused. Candidates for future decks or future units:

- **Family & professions** (doctor, teacher, student, classmate, Mr./Miss) → a "Meeting People" unit later.
- **Days, months, weather** → a "Calendar & Weather" unit later.
- **Home & tech vocabulary** (cat, dog, TV, computer, phone, movie, cup, table, chair, book, clothes, money, character) → "Things Around You" unit.
- **Transport** (airplane, taxi, train station) → folded into a future "Getting Around — Transport" unit.
- **Proper nouns** (China, Beijing) → introduced in context, not as standalone cards.
- **Less-common food items** (sweet potato, leek, snow peas, wood ear mushroom, scallop, clam, squid, crab, lamb, bread, pepper) → expansion food unit.
- **Drink / smoke / alcohol culture beyond the basics** → could grow into a "Toasts & Hosting" unit.

The HSK 1 measure words (`个`, `岁`, `本`, `些`, `块`) are also deferred — they're hard to learn in isolation and are better picked up in context once the learner has more sentences under their belt.

## Open questions for the JSON pass

- **Card IDs.** `unit-id.card-slug`? Or globally unique slugs? The spec only requires uniqueness within the deck, so unit-scoped IDs are fine.
- **Pattern phrases with a slot.** "Please can I have ___" and "I'd like something with rice/noodles/vegetables" — do we render the slot in the card, or expand into three concrete cards? Leaning toward concrete cards for v1 (simpler, no UI work to handle slots).
- **Token granularity for fixed greetings.** `你好` — one token or two? Probably one (it's a fixed compound), with the gloss "hello". Same for `谢谢`, `再见`, `对不起`.
- **Romanization style.** Spec already says tone marks, not tone numbers. Reaffirm here.
- **Deck size sanity check.** Roughly 130–150 cards across 11 units — comparable to HSK 1 vocab count, but split across phrase and word cards so it should feel lighter to drill.

## Suggested ordering rationale

Units 1–5 are foundations and can be drilled in any order, but Greetings first gives the fastest dopamine hit. Units 6–11 are scenario-based and assume the foundations. Within a session, the SRS layer (still to be designed) will surface cards across units based on the learner's state — but the **default first pass** should follow the unit order so that scenario phrases land on prepared ground.
