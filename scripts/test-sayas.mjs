// Pure-Node test runner for sayAs. The file under test is a browser module
// that publishes its API via Object.assign(window, …), so we evaluate it with
// a stub window and read the functions back off it.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const src = readFileSync(resolve(here, '..', 'jz-data.jsx'), 'utf8');

const win = {};
new Function('window', src)(win);
const { sayAs } = win;

const cases = {
  // Bare-vowel glides — y/w are silent
  yi: 'ee', wu: 'oo', yu: 'yoo',

  // iou / iu finals
  you: 'yoh', jiu: 'jyoh', liu: 'lyoh', niu: 'nyoh', xiu: 'shyoh',

  // ao final — must read as [aʊ], not English "low/bow/dao"
  lao: 'laow', hao: 'haow', bao: 'baow', tao: 'taow', dao: 'daow', mao: 'maow',
  zhao: 'jaow', chao: 'chaow', shao: 'shaow',

  // j/q/x + ü-derived finals — y-glide is dropped (sh/ch/j imply the front
  // articulation), and ün is rounded to 'oon' not 'un'.
  xue: 'shweh', que: 'chweh', jue: 'jweh',
  xuan: 'shwen', quan: 'chwen', juan: 'jwen',
  xun: 'shoon', qun: 'choon', jun: 'joon',
  xu: 'shoo', qu: 'choo', ju: 'joo',
  yun: 'yoon',

  // Buzzed-i after retroflex/sibilant initials
  shi: 'shrr', chi: 'chrr', zi: 'dzrr', ci: 'tsrr', si: 'srr', zhi: 'jrr', ri: 'rrr',

  // Compact multi-syllable words (rule-derived)
  xiexie: 'shyeh-shyeh',
  zaijian: 'dzeye-jyen',
  duibuqi: 'dway-boo-chee',
  keqi: 'kuh-chee',
  'bu keqi': 'boo kuh-chee',
  bukeqi: 'boo-kuh-chee',
  xuesheng: 'shweh-shung',
  pengyou: 'pung-yoh',
  laoshi: 'laow-shrr',

  // The one genuine override that survives rule expansion
  mingzi: 'ming-dzuh',

  // Toned input — tone marks must be stripped transparently
  'yī': 'ee', 'wǔ': 'oo', 'yǒu': 'yoh', 'lǎoshī': 'laow-shrr',
  'nǐ hǎo': 'nee haow', 'xièxie': 'shyeh-shyeh',
};

let fails = 0;
for (const [input, expected] of Object.entries(cases)) {
  const got = sayAs(input);
  if (got !== expected) {
    fails++;
    console.error(`FAIL  sayAs(${JSON.stringify(input)}) → ${JSON.stringify(got)}, want ${JSON.stringify(expected)}`);
  }
}

const total = Object.keys(cases).length;
if (fails) {
  console.error(`\n${fails}/${total} cases failed.`);
  process.exit(1);
}
console.log(`OK  ${total}/${total} cases passed.`);
