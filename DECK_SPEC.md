# Jizhu Deck Specification

A Jizhu deck is a single JSON file served over HTTP(S). The deck's URL is its unique identifier — all local progress state is keyed by that URL.

## Top-level shape

```json
{
  "title": "HSK 1 Core",
  "units": [
    {
      "id": "greetings",
      "title": "Greetings",
      "cards": []
    }
  ]
}
```

| Field   | Type              | Required | Description                                  |
| ------- | ----------------- | -------- | -------------------------------------------- |
| `title` | string            | yes      | Human-readable deck name shown in the UI.    |
| `units` | array of Unit     | yes      | Ordered list of units that group cards.      |

## Unit

```json
{
  "id": "greetings",
  "title": "Greetings",
  "cards": []
}
```

| Field   | Type          | Required | Description                                                  |
| ------- | ------------- | -------- | ------------------------------------------------------------ |
| `id`    | string        | yes      | Stable identifier for the unit, unique within the deck.      |
| `title` | string        | yes      | Human-readable unit name.                                    |
| `cards` | array of Card | yes      | Ordered list of cards belonging to this unit.                |

## Card

```json
{
  "id": "wo-bu-xihuan-yinyueke",
  "hanzi": "我不喜欢音乐课",
  "pinyin": "wǒ bù xǐhuan yīnyuè kè",
  "translation": "I do not like music class",
  "tokens": [
    { "hanzi": "我",   "pinyin": "wǒ",     "gloss": "I / me" },
    { "hanzi": "不",   "pinyin": "bù",     "gloss": "not" },
    { "hanzi": "喜欢", "pinyin": "xǐhuan", "gloss": "like" },
    { "hanzi": "音乐", "pinyin": "yīnyuè", "gloss": "music" },
    { "hanzi": "课",   "pinyin": "kè",     "gloss": "class / lesson" }
  ]
}
```

| Field         | Type           | Required | Description                                                                 |
| ------------- | -------------- | -------- | --------------------------------------------------------------------------- |
| `id`          | string         | yes      | Stable identifier for the card, unique within the deck.                     |
| `hanzi`       | string         | yes      | The full Chinese phrase in hanzi.                                           |
| `pinyin`      | string         | yes      | The full phrase in pinyin, written with tone marks (not tone numbers).      |
| `translation` | string         | yes      | English translation of the phrase.                                          |
| `tokens`      | array of Token | yes      | Decomposition of the phrase into its component words/characters.            |

## Token

A token represents one meaningful unit of the phrase — typically a word, which may be one or more hanzi characters.

| Field    | Type   | Required | Description                                                  |
| -------- | ------ | -------- | ------------------------------------------------------------ |
| `hanzi`  | string | yes      | The hanzi for this token.                                    |
| `pinyin` | string | yes      | The pinyin for this token, with tone marks.                  |
| `gloss`  | string | yes      | Short English gloss for this token. Use ` / ` for multiple senses. |

## Identifiers and stability

- Deck URLs are the unit of identity for local progress. Changing a deck's hosting URL resets local progress for that deck.
- `unit.id` and `card.id` should be stable across deck revisions. If an `id` changes, the app will treat it as a new card and lose its progress.

## Conventions

- All text is UTF-8.
- Pinyin uses tone marks (`wǒ`, `xǐhuan`) rather than tone numbers (`wo3`, `xi3huan`).
- `tokens` should reconstruct the full phrase in order when concatenated.
