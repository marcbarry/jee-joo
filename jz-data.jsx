// Pinyin → English approximation, plus small token helpers.
// Per requirements: the deck stores pinyin only; the say-as approximation is
// an app concern. Mandarin has ~400 syllables (1300 with tones); the function
// below covers them all via initial + final rewrite rules, with a handful of
// overrides for awkward cases the rules would mishandle.

// Pinyin initials → English-friendly consonant sound.
const INITIAL_MAP = {
  ''  : '',
  b: 'b', p: 'p', m: 'm', f: 'f',
  d: 'd', t: 't', n: 'n', l: 'l',
  g: 'g', k: 'k', h: 'h',
  j: 'j', q: 'ch', x: 'sh',
  r: 'r',
  z: 'dz', c: 'ts', s: 's',
  zh: 'j', ch: 'ch', sh: 'sh',
  y: '',  w: 'w',
};

// Pinyin finals → English-friendly vowel/coda. Longest-match wins; the lookup
// is keyed on the exact final string, so iang/iong/uang/ueng (4-char) and the
// 3-char finals come before their 2-char prefixes by virtue of object lookup.
const FINAL_MAP = {
  // 4-char
  iang: 'yahng', iong: 'yoong', uang: 'wahng', ueng: 'wung',
  // 3-char
  iao: 'yow', ian: 'yen', iou: 'yo', ing: 'ing',
  uai: 'why', uan: 'wahn',
  uei: 'way', uen: 'wun',
  ang: 'ahng', eng: 'ung', ong: 'oong',
  'üan': 'ywen',
  // 2-char
  ia: 'yah', ie: 'yeh', iu: 'yo', in: 'een',
  ua: 'wah', uo: 'waw', ui: 'way', un: 'wun',
  'üe': 'yweh', 'ün': 'yun',
  ai: 'eye', ei: 'ay', ao: 'ow', ou: 'oh',
  an: 'ahn', en: 'uhn', er: 'are',
  // 1-char
  a: 'ah', o: 'aw', e: 'uh',
  i: 'ee', u: 'oo', 'ü': 'yoo',
};

// After zh/ch/sh/r/z/c/s, bare 'i' is the buzzed retroflex/sibilant — sounds
// like "rr", not "ee". (chī → "chrr", not "chee".)
const BUZZED_I_INITIALS = new Set(['zh', 'ch', 'sh', 'r', 'z', 'c', 's']);

// After j/q/x/y, an orthographic 'u' actually represents the ü sound.
const JQXY = new Set(['j', 'q', 'x', 'y']);

// Whole-syllable overrides for cases where the rule output reads awkwardly to
// English speakers. Keep this small — the rules cover the vast majority.
const OVERRIDES = {
  // w-/y- bare syllables
  wu: 'oo',
  yi: 'ee',
  // j/q/x + ü-merged spellings — rules would produce y-prefixed glides
  xue:  'shweh',  que:  'chweh',  jue:  'jweh',
  xuan: 'shwen',  quan: 'chwen',  juan: 'jwen',
  xun:  'shoon',  qun:  'choon',  jun:  'joon',
};

// Strip sentence punctuation around a pinyin syllable.
function cleanPinyinSyllable(p) {
  return p
    .replace(/^[“"'<([{]+|[”"'>)\]}.,!?;:。？！、，；：]+$/g, '')
    .toLowerCase();
}

// Strip tone marks → bare syllable, lowercased, for rule lookup. Toned ü vowels
// stay in the ü class so nü/lü remain distinct from nu/lu.
function stripTones(p) {
  const map = {
    'ā':'a','á':'a','ǎ':'a','à':'a',
    'ē':'e','é':'e','ě':'e','è':'e',
    'ī':'i','í':'i','ǐ':'i','ì':'i',
    'ō':'o','ó':'o','ǒ':'o','ò':'o',
    'ū':'u','ú':'u','ǔ':'u','ù':'u',
    'ǖ':'ü','ǘ':'ü','ǚ':'ü','ǜ':'ü',
  };
  return cleanPinyinSyllable(p).split('').map(c => map[c] || c).join('');
}

function normalizeYW(bare) {
  if (bare === 'yi') return bare;
  if (bare === 'wu') return bare;
  if (bare === 'yu') return 'ü';

  // y marks i-/ü-family finals when no consonant initial is written.
  if (bare.startsWith('y')) {
    const rest = bare.slice(1);
    if (['ue', 'uan', 'un'].includes(rest)) return 'ü' + rest.slice(1);
    if (rest === 'ong') return 'iong';
    return 'i' + rest;
  }

  // w marks u-family finals when no consonant initial is written.
  if (bare.startsWith('w')) {
    const rest = bare.slice(1);
    if (rest === 'u') return 'u';
    return 'u' + rest;
  }

  return bare;
}

function splitSyllable(bare) {
  if (/^(zh|ch|sh)/.test(bare)) return [bare.slice(0, 2), bare.slice(2)];
  if (/^[bpmfdtnlgkhjqxrzcsyw]/.test(bare)) return [bare[0], bare.slice(1)];
  return ['', bare];
}

// Pinyin (with or without tone marks) → English approximation.
function sayAs(pinyin) {
  if (!pinyin) return '';
  // A multi-syllable phrase falls back to per-syllable lookup. Pinyin in our
  // decks is mostly one token = one syllable, but we handle space-separated
  // input defensively.
  if (/\s/.test(pinyin)) {
    return pinyin.split(/\s+/).map(sayAs).join(' ');
  }

  const bare = normalizeYW(stripTones(pinyin));
  if (!bare) return '';

  if (OVERRIDES[bare]) return OVERRIDES[bare];

  let [initial, final] = splitSyllable(bare);

  // j/q/x/y + u-final → ü-final orthography
  if (JQXY.has(initial) && final.startsWith('u')) {
    final = 'ü' + final.slice(1);
  }

  // Buzzed-i after retroflex/sibilant initials
  if (final === 'i' && BUZZED_I_INITIALS.has(initial)) {
    return (INITIAL_MAP[initial] ?? '') + 'rr';
  }

  const initialSound = INITIAL_MAP[initial] ?? '';
  const finalSound   = FINAL_MAP[final]    ?? final;
  return initialSound + finalSound;
}

// Render a pattern card with a specific infill chosen (used during review)
function renderPattern(card, infillIdx) {
  const fill = card.slot.options[infillIdx];
  return {
    tokens: card.template.map(t => t.slot ? fill : t),
    answer: fill,
  };
}

function tokensToPinyin(tokens) {
  return tokens.map(t => t.pinyin).join(' ');
}
function tokensToSay(tokens) {
  return tokens.map(t => sayAs(t.pinyin)).join(' ');
}

Object.assign(window, {
  sayAs, stripTones, renderPattern,
  tokensToPinyin, tokensToSay,
});
