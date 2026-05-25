// Pure-Node test runner for jz-data.jsx. The file under test is a browser
// module that publishes its API via Object.assign(window, …), so we evaluate
// it with a stub window and read the exports back off it.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const src = readFileSync(resolve(here, '..', 'jz-data.jsx'), 'utf8');

const win = {};
new Function('window', src)(win);
const {
  sayAs, stripTones, splitPinyinSyllables, pinyinSpaced,
  tokensToPinyin, tokensToSay, renderPattern,
} = win;

let pass = 0, fail = 0;
function eq(label, got, want) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (ok) pass++;
  else {
    fail++;
    console.error(`  FAIL  ${label}`);
    console.error(`        got:  ${JSON.stringify(got)}`);
    console.error(`        want: ${JSON.stringify(want)}`);
  }
}
function group(name, body) {
  const before = fail;
  body();
  const localFail = fail - before;
  console.log(`${localFail ? 'x' : '.'} ${name}`);
}
function table(fn, cases) {
  for (const [input, want] of Object.entries(cases)) {
    eq(`${fn.name}(${JSON.stringify(input)})`, fn(input), want);
  }
}

// ─── sayAs ────────────────────────────────────────────────────────────────

group('sayAs — every initial × bare-a', () => table(sayAs, {
  ba:'bah', pa:'pah', ma:'mah', fa:'fah',
  da:'dah', ta:'tah', na:'nah', la:'lah',
  ga:'gah', ka:'kah', ha:'hah',
  za:'dzah', ca:'tsah', sa:'sah',
  zha:'jah', cha:'chah', sha:'shah',
}));

group('sayAs — every final × representative initial', () => table(sayAs, {
  // 1-char
  a:'ah', o:'aw', e:'uh',
  // 2-char (consonant-headed)
  bai:'beye', bei:'bay', bao:'baow', dou:'doh',
  ban:'bahn', ben:'buhn', bang:'bahng', beng:'bung', dong:'doong',
  // i-family after consonant
  bi:'bee', bia:'byah', bie:'byeh', biao:'byow', bian:'byen',
  bin:'been', bing:'bing', diu:'dyoh',
  // u-family after consonant
  duan:'dwahn', dui:'dway', dun:'dwun', duo:'dwaw',
  gua:'gwah', guai:'gwhy', guang:'gwahng',
  // er
  er:'are',
}));

group('sayAs — j/q/x + ü drop-y rule', () => table(sayAs, {
  ju:'joo',   qu:'choo',  xu:'shoo',
  jue:'jweh', que:'chweh', xue:'shweh',
  juan:'jwen', quan:'chwen', xuan:'shwen',
  jun:'joon',  qun:'choon',  xun:'shoon',
}));

group('sayAs — j/q/x + i finals (i is regular, not buzzed)', () => table(sayAs, {
  ji:'jee', qi:'chee', xi:'shee',
  jia:'jyah', qiang:'chyahng', xiong:'shyoong',
  jin:'jeen', qing:'ching', xin:'sheen',
}));

group('sayAs — buzzed-i after retroflex/sibilant', () => table(sayAs, {
  shi:'shrr', chi:'chrr', zhi:'jrr', ri:'rrr',
  zi:'dzrr',  ci:'tsrr',  si:'srr',
}));

group('sayAs — y/w bare syllables (silent glide)', () => table(sayAs, {
  yi:'ee',   wu:'oo',   yu:'yoo',
  yin:'een', ying:'ing',                  // regression: previously 'iin'/'iing'
  ya:'yah',  ye:'yeh',  yao:'yow', you:'yoh',
  yan:'yen', yang:'yahng', yong:'yoong',
  yue:'yweh', yuan:'ywen', yun:'yoon',
  wa:'wah', wai:'why', wei:'way',
  wan:'wahn', wen:'wun', wang:'wahng', weng:'wung', wo:'waw',
}));

group('sayAs — ü after l/n preserves rounded vowel', () => table(sayAs, {
  // Toned ü is required so stripTones routes through the ü class.
  'lǚ':'lyoo', 'nǚ':'nyoo',
  'lüè':'lyweh', 'nüè':'nyweh',
}));

group('sayAs — ao final reads as [aʊ] not [oʊ]', () => table(sayAs, {
  lao:'laow', mao:'maow', bao:'baow', tao:'taow', dao:'daow',
  hao:'haow', sao:'saow', zhao:'jaow', chao:'chaow', shao:'shaow',
}));

group('sayAs — iou/iu finals drop into "yoh"', () => table(sayAs, {
  you:'yoh', jiu:'jyoh', liu:'lyoh', niu:'nyoh', xiu:'shyoh',
  diu:'dyoh',
}));

group('sayAs — compound words split by rules', () => table(sayAs, {
  xiexie:    'shyeh-shyeh',
  zaijian:   'dzeye-jyen',
  duibuqi:   'dway-boo-chee',
  keqi:      'kuh-chee',
  bukeqi:    'boo-kuh-chee',
  xuesheng:  'shweh-shung',
  pengyou:   'pung-yoh',
  laoshi:    'laow-shrr',
  yinyue:    'een-yweh',
  wushi:     'oo-shrr',     // compound 'wu' must route via normalizeYW, not the
                            // override that only covered standalone 'wu'.
  nihao:     'nee-haow',
}));

group('sayAs — multi-word phrases (whitespace branch)', () => table(sayAs, {
  'ni hao':       'nee haow',
  'wo ai ni':     'waw eye nee',
  'bu keqi':      'boo kuh-chee',
  'duo shao qian':'dwaw shaow chyen',
}));

group('sayAs — tone marks transparent to output', () => table(sayAs, {
  'mā':'mah', 'má':'mah', 'mǎ':'mah', 'mà':'mah',     // 4 tones × a
  'mēng':'mung', 'méng':'mung', 'měng':'mung', 'mèng':'mung',
  'lǐ':'lee', 'wǒ':'waw', 'nǐ':'nee', 'hǎo':'haow',
}));

group('sayAs — sentence punctuation stripped on input', () => table(sayAs, {
  'hǎo?':'haow', 'nǐ.':'nee', 'wǒ!':'waw', 'lái，':'leye',
}));

group('sayAs — empty / falsy input', () => table(sayAs, {
  '':'', // empty string
}));

group('sayAs — null / undefined safety', () => {
  eq('sayAs(null)',      sayAs(null),      '');
  eq('sayAs(undefined)', sayAs(undefined), '');
});

group('sayAs — the surviving override', () => table(sayAs, {
  mingzi:'ming-dzuh',
  'míngzi':'ming-dzuh',
}));

// ─── stripTones ───────────────────────────────────────────────────────────

group('stripTones — every tone × vowel', () => table(stripTones, {
  'ā':'a','á':'a','ǎ':'a','à':'a',
  'ē':'e','é':'e','ě':'e','è':'e',
  'ī':'i','í':'i','ǐ':'i','ì':'i',
  'ō':'o','ó':'o','ǒ':'o','ò':'o',
  'ū':'u','ú':'u','ǔ':'u','ù':'u',
}));

group('stripTones — toned ü stays in ü class', () => table(stripTones, {
  'ǖ':'ü','ǘ':'ü','ǚ':'ü','ǜ':'ü',
}));

group('stripTones — case-fold and punctuation', () => table(stripTones, {
  'Yǒu':'you', 'Cèsuǒ':'cesuo', 'Xièxie?':'xiexie', '"Nǐ"':'ni',
}));

// ─── splitPinyinSyllables ─────────────────────────────────────────────────

group('splitPinyinSyllables — compact splits', () => {
  eq('Duìbuqǐ',  splitPinyinSyllables('Duìbuqǐ'),  ['Duì','bu','qǐ']);
  eq('Xièxie',   splitPinyinSyllables('Xièxie'),   ['Xiè','xie']);
  eq('Zàijiàn',  splitPinyinSyllables('Zàijiàn'),  ['Zài','jiàn']);
  eq('Pengyou',  splitPinyinSyllables('péngyou'),  ['péng','you']);
});

group('splitPinyinSyllables — already-spaced passes through', () => {
  eq('nǐ hǎo',     splitPinyinSyllables('nǐ hǎo'),     ['nǐ','hǎo']);
  eq('Wǒ ài nǐ',   splitPinyinSyllables('Wǒ ài nǐ'),   ['Wǒ','ài','nǐ']);
});

group('splitPinyinSyllables — trailing punctuation rides last syllable', () => {
  eq('Xièxie!', splitPinyinSyllables('Xièxie!'), ['Xiè','xie!']);
  eq('hǎo?',    splitPinyinSyllables('hǎo?'),    ['hǎo?']);
});

group('splitPinyinSyllables — unsplittable / empty', () => {
  eq('hǎo',          splitPinyinSyllables('hǎo'),  ['hǎo']);     // single syllable
  eq('empty',        splitPinyinSyllables(''),     []);
  eq('null',         splitPinyinSyllables(null),   []);
  eq('undefined',    splitPinyinSyllables(undefined), []);
});

group('pinyinSpaced — joins splitter output', () => table(pinyinSpaced, {
  'Duìbuqǐ':'Duì bu qǐ',
  'xièxie':'xiè xie',
  'nǐ hǎo':'nǐ hǎo',
  'hǎo':'hǎo',
}));

// ─── token helpers ────────────────────────────────────────────────────────

group('tokensToPinyin', () => {
  eq('single', tokensToPinyin([{pinyin:'wǒ'}]), 'wǒ');
  eq('triple', tokensToPinyin([{pinyin:'wǒ'},{pinyin:'ài'},{pinyin:'nǐ'}]), 'wǒ ài nǐ');
  eq('multi-syllable token expanded',
    tokensToPinyin([{pinyin:'Duìbuqǐ'}]),
    'Duì bu qǐ');
});

group('tokensToSay', () => {
  eq('triple', tokensToSay([{pinyin:'wǒ'},{pinyin:'ài'},{pinyin:'nǐ'}]), 'waw eye nee');
  eq('compact token', tokensToSay([{pinyin:'Pengyou'}]), 'pung-yoh');
});

// ─── renderPattern ────────────────────────────────────────────────────────

group('renderPattern — slot infill and answer', () => {
  const card = {
    template: [
      { hanzi: '我', pinyin: 'wǒ' },
      { hanzi: '要', pinyin: 'yào' },
      { hanzi: '去', pinyin: 'qù' },
      { slot: 'place' },
    ],
    slot: {
      options: [
        { hanzi: '机场', pinyin: 'jīchǎng' },
        { hanzi: '酒店', pinyin: 'jiǔdiàn' },
      ],
    },
  };
  const r0 = renderPattern(card, 0);
  eq('idx 0 tokens', r0.tokens, [
    { hanzi: '我', pinyin: 'wǒ' },
    { hanzi: '要', pinyin: 'yào' },
    { hanzi: '去', pinyin: 'qù' },
    { hanzi: '机场', pinyin: 'jīchǎng' },
  ]);
  eq('idx 0 answer', r0.answer, { hanzi: '机场', pinyin: 'jīchǎng' });
  eq('idx 1 answer', renderPattern(card, 1).answer, { hanzi: '酒店', pinyin: 'jiǔdiàn' });
});

// ─── results ──────────────────────────────────────────────────────────────

console.log('');
if (fail) {
  console.error(`${fail}/${pass + fail} cases failed.`);
  process.exit(1);
}
console.log(`OK  ${pass}/${pass} cases passed.`);
