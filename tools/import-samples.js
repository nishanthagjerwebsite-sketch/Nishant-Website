// Builds the SOUND LIBRARY: assets/sounds/library/<id>.wav plus assets/sounds/library/manifest.json.
//
// Two kinds of sources:
//  - Nishant's OWN recordings, read from the NH folder (kick, snare, toms). Set NH_DIR to point at it
//    (default: ~/Downloads/NH). They keep their stereo image and are only trimmed, loudness-matched and limited.
//  - DEMO sounds (hi-hat, cymbals, cross stick): real CC0 recordings from the "Recorded drums" release of
//    github.com/Nullframe/daw-content (built from VCSL and Karoryfer samples). They are placeholders until his own arrive.
//
// Sounds are grouped by the drum or cymbal they belong to; the Play page only lets a sound be dropped onto a part of
// the same group. To add a recording by hand, drop a WAV in assets/sounds/library/ and add it to manifest.json.
// Usage: npm run samples
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RELEASE = 'https://github.com/Nullframe/daw-content/releases/download/drums-recorded-cc0-2026-09-30/';
const outDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'sounds', 'library');
const NH_DIR = process.env.NH_DIR || path.join(os.homedir(), 'Downloads', 'NH');
const cache = path.join(os.tmpdir(), 'nishant-drum-sources');
fs.mkdirSync(cache, { recursive: true });

// A source is either a CC0 recording name (string) or { nh: 'FOLDER/File.wav' } inside the NH folder.
// group: id, label, note, shape [max seconds, target loudness dBFS, tail fade ms], demo (true = placeholder sounds),
// stereo (keep the recording's channels), sounds [id, name, tag, source]
const GROUPS = [
  // ---------------- Nishant's own recordings (NH folder) ----------------
  { id: 'kick', label: 'Kick drum', note: 'Fits the 22″ kick', shape: [1.2, -10.5, 120], stereo: true, sounds: [
    ['kick-d6-hard-1', 'D6 kick', 'Hard 1', { nh: 'KICK/HARD D6-001.wav' }],
    ['kick-d6-hard-2', 'D6 kick', 'Hard 2', { nh: 'KICK/HARD D6-003.wav' }],
    ['kick-d6-normal', 'D6 kick', 'Normal', { nh: 'KICK/NORMAL D6-002.wav' }],
    ['kick-ba19-hard', 'BA19 kick', 'Hard', { nh: 'KICK/HARD BA19 -001.wav' }],
  ] },
  { id: 'snare', label: 'Snare', note: 'Fits the 14″ snare and the black side snare', shape: [2.0, -10.5, 250], stereo: true, sounds: [
    ['snare-goblin', 'Goblin C', 'Rimshot', { nh: 'SNARE/GOBLIN C RIMSHOT 1.wav' }],
    ['snare-solidus', 'Solidus B', 'Rimshot 3', { nh: 'SNARE/SOLIDUS B RIMSHOT 3 .wav' }],
    ['snare-atomizer', 'Atomizer C', 'Rimshot', { nh: 'SNARE/C ATOMIZER RIMSHOT 1 .wav' }],
  ] },
  { id: 'tom-8', label: '8″ tom', note: 'Fits the 8″ rack tom', shape: [3.2, -11, 500], stereo: true, sounds: [
    ['tom-8-1', '8″ tom', 'Hard 1', { nh: 'TOMS/8 INCH HARD 1.wav' }],
    ['tom-8-2', '8″ tom', 'Hard 2', { nh: 'TOMS/8 INCH HARD 2.wav' }],
  ] },
  { id: 'tom-10', label: '10″ tom', note: 'Fits the 10″ rack tom', shape: [3.2, -11, 500], stereo: true, sounds: [
    ['tom-10-1', '10″ tom', 'Hard 1', { nh: 'TOMS/10 INCH HARD 1.wav' }],
    ['tom-10-2', '10″ tom', 'Hard 2', { nh: 'TOMS/10 INCH HARD 2.wav' }],
  ] },
  { id: 'tom-12', label: '12″ tom', note: 'Fits the 12″ rack tom', shape: [3.2, -11, 500], stereo: true, sounds: [
    ['tom-12-1', '12″ tom', 'Hard 1', { nh: 'TOMS/12 INCH HARD 1.wav' }],
    ['tom-12-2', '12″ tom', 'Hard 2', { nh: 'TOMS/12 INCH HARD 2.wav' }],
  ] },
  { id: 'tom-13', label: '13″ tom', note: 'Fits the 13″ rack tom', shape: [3.2, -11, 500], stereo: true, sounds: [
    ['tom-13-1', '13″ tom', 'Hard 1', { nh: 'TOMS/13 INCH HARD 1.wav' }],
    ['tom-13-2', '13″ tom', 'Hard 2', { nh: 'TOMS/13 INCH HARD 2.wav' }],
  ] },
  { id: 'tom-14', label: '14″ tom', note: 'Fits the 14″ floor tom', shape: [3.2, -11, 500], stereo: true, sounds: [
    ['tom-14-1', '14″ tom', 'Hard 1', { nh: 'TOMS/14 INCH HARD 1.wav' }],
    ['tom-14-2', '14″ tom', 'Hard 2', { nh: 'TOMS/14 INCH HARD 2.wav' }],
  ] },
  { id: 'tom-16', label: '16″ tom', note: 'Fits the 16″ floor tom', shape: [3.2, -11, 500], stereo: true, sounds: [
    ['tom-16-1', '16″ tom', 'Hard 1', { nh: 'TOMS/16 INCH HARD 1.wav' }],
    ['tom-16-2', '16″ tom', 'Hard 2', { nh: 'TOMS/16 INCH HARD 2.wav' }],
  ] },
  { id: 'tom-18', label: '18″ tom', note: 'Fits the 18″ floor tom', shape: [3.2, -11, 500], stereo: true, sounds: [
    ['tom-18-1', '18″ tom', 'Hard 1', { nh: 'TOMS/18 INCH HARD 1.wav' }],
    ['tom-18-2', '18″ tom', 'Hard 2', { nh: 'TOMS/18 INCH HARD 2.wav' }],
  ] },
  // ---------------- demo sounds (placeholders until his own cymbals and hats arrive) ----------------
  { id: 'cross-stick', label: 'Cross stick', note: 'Fits the snare rim', demo: true, shape: [0.35, -12], sounds: [
    ['xs-1', 'Side stick I', 'Wood', 'rim-sidestick-f-rr1'],
    ['xs-2', 'Side stick II', 'Wood', 'rim-sidestick-f-rr2'],
    ['xs-3', 'Side stick III', 'Wood', 'rim-sidestick-f-rr3'],
    ['xs-4', 'Side stick IV', 'Wood', 'rim-sidestick-f-rr4'],
    ['xs-claves', 'Claves', 'Percussion', 'claves-1-f'],
    ['xs-woodblock', 'Woodblock', 'Percussion', 'woodblock-f-rr1'],
    ['xs-slapstick', 'Slapstick', 'Percussion', 'slapstick-f-rr1'],
  ] },
  { id: 'hihat-closed', label: 'Hi-hat closed', note: 'Fits the closed hi-hat', demo: true, shape: [0.35, -13], sounds: [
    ['hc-1', '14″ hats', 'Hard', 'hat-closed-14in-f-rr1'],
    ['hc-2', '14″ hats II', 'Hard', 'hat-closed-14in-f-rr2'],
    ['hc-3', '14″ hats', 'Soft', 'hat-closed-14in-mf-rr1'],
    ['hc-4', '14″ hats II', 'Soft', 'hat-closed-14in-mf-rr2'],
    ['hc-v1', 'Vintage hats', 'A', 'hat-closed-vcsl-f-rr1'],
    ['hc-v2', 'Vintage hats', 'B', 'hat-closed-vcsl-f-rr2'],
  ] },
  { id: 'hihat-open', label: 'Hi-hat open', note: 'Fits the open hi-hat', demo: true, shape: [1.8, -13], sounds: [
    ['ho-1', '14″ hats open', 'A', 'hat-open-14in-f-rr1'],
    ['ho-2', '14″ hats open', 'B', 'hat-open-14in-f-rr2'],
    ['ho-3', '14″ hats open', 'C', 'hat-open-14in-f-rr3'],
    ['ho-v1', 'Vintage hats open', 'A', 'hat-open-vcsl-f-rr1'],
    ['ho-v2', 'Vintage hats open', 'B', 'hat-open-vcsl-f-rr2'],
  ] },
  { id: 'hihat-foot', label: 'Hi-hat foot', note: 'Fits the hi-hat pedal', demo: true, shape: [0.3, -13], sounds: [
    ['hf-1', '14″ pedal chick', 'A', 'hat-pedal-14in-f-rr1'],
    ['hf-2', '14″ pedal chick', 'B', 'hat-pedal-14in-f-rr2'],
    ['hf-3', '14″ pedal chick', 'C', 'hat-pedal-14in-f-rr3'],
    ['hf-v1', 'Vintage pedal', 'A', 'hat-pedal-vcsl-rr1'],
    ['hf-v2', 'Vintage pedal', 'B', 'hat-pedal-vcsl-rr2'],
  ] },
  { id: 'crash', label: 'Crash', note: 'Fits both crash cymbals', demo: true, shape: [3.0, -12], sounds: [
    ['crash-a', '17″ crash', 'A', 'crash-17in-f-rr1'],
    ['crash-b', '17″ crash', 'B', 'crash-17in-f-rr2'],
    ['crash-hard', '17″ crash', 'Hard', 'crash-17in-ff-rr2'],
    ['crash-mallet', '17″ crash', 'Mallet', 'crash-17in-mallet-ff-rr1'],
    ['crash-clash-1', 'Clash cymbals I', 'Orchestral', 'crash-clash-1-ff-rr2'],
    ['crash-clash-2', 'Clash cymbals II', 'Orchestral', 'crash-clash-2-fff-rr1'],
    ['crash-suspended', 'Suspended cymbal', 'Orchestral', 'crash-suspended-1-f'],
  ] },
  { id: 'ride', label: 'Ride', note: 'Fits the ride cymbal', demo: true, shape: [3.0, -13], sounds: [
    ['ride-1', '22″ ride', 'Strong I', 'ride-22in-f-rr1'],
    ['ride-2', '22″ ride', 'Strong II', 'ride-22in-f-rr2'],
    ['ride-3', '22″ ride', 'Strong III', 'ride-22in-f-rr3'],
    ['ride-4', '22″ ride', 'Soft I', 'ride-22in-mf-rr1'],
    ['ride-5', '22″ ride', 'Soft II', 'ride-22in-mf-rr2'],
    ['ride-6', '22″ ride', 'Soft III', 'ride-22in-mf-rr3'],
  ] },
  { id: 'china', label: 'China', note: 'Fits the black china cymbal', demo: true, shape: [2.6, -12], sounds: [
    ['china-1', 'Suspended trash I', 'Dark', 'crash-suspended-1-fff'],
    ['china-2', 'Suspended trash II', 'Dark', 'crash-suspended-2-fff'],
    ['china-3', 'Clash trash I', 'Washy', 'crash-clash-1-ff-rr3'],
    ['china-4', 'Clash trash II', 'Washy', 'crash-clash-2-fff-rr2'],
  ] },
  { id: 'splash', label: 'Splash', note: 'Fits both splash cymbals', demo: true, shape: [1.3, -12], sounds: [
    ['splash-1', 'Choked cymbal I', 'Short', 'crash-clash-choked-rr1'],
    ['splash-2', 'Choked cymbal II', 'Short', 'crash-clash-choked-rr2'],
    ['splash-3', 'Triangle I', 'Bright', 'triangle-f-rr1'],
    ['splash-4', 'Triangle II', 'Bright', 'triangle-f-rr2'],
  ] },
];

async function fetchSource(name) {
  const file = path.join(cache, `${name}.wav`);
  if (!fs.existsSync(file)) {
    const res = await fetch(`${RELEASE}${name}.wav`);
    if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`);
    fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  }
  return fs.readFileSync(file);
}
function readLocal(rel) {
  const file = path.join(NH_DIR, rel);
  if (!fs.existsSync(file)) throw new Error(`Missing ${file}. Set NH_DIR to the folder that holds KICK, SNARE and TOMS.`);
  return fs.readFileSync(file);
}

// Decode a WAV (16/24/32-bit PCM or 32-bit float) into one Float32Array per channel.
function readWav(buf) {
  if (buf.toString('ascii', 0, 4) !== 'RIFF') throw new Error('not a WAV');
  let fmt, data, pos = 12;
  while (pos + 8 <= buf.length) {
    const id = buf.toString('ascii', pos, pos + 4), size = buf.readUInt32LE(pos + 4);
    if (id === 'fmt ') {
      let tag = buf.readUInt16LE(pos + 8);
      if (tag === 0xfffe) tag = buf.readUInt16LE(pos + 32);
      fmt = { tag, ch: buf.readUInt16LE(pos + 10), sr: buf.readUInt32LE(pos + 12), bits: buf.readUInt16LE(pos + 22) };
    } else if (id === 'data') { data = buf.subarray(pos + 8, pos + 8 + size); break; }
    pos += 8 + size + (size & 1);
  }
  if (!fmt || !data) throw new Error('bad WAV');
  const bytes = fmt.bits / 8, frames = Math.floor(data.length / (bytes * fmt.ch));
  const channels = Array.from({ length: fmt.ch }, () => new Float32Array(frames));
  for (let i = 0; i < frames; i++) {
    for (let c = 0; c < fmt.ch; c++) {
      const o = (i * fmt.ch + c) * bytes;
      channels[c][i] = fmt.tag === 3 ? data.readFloatLE(o)
        : fmt.bits === 16 ? data.readInt16LE(o) / 32768
        : fmt.bits === 24 ? data.readIntLE(o, 3) / 8388608
        : data.readInt32LE(o) / 2147483648;
    }
  }
  return { channels, sr: fmt.sr };
}
const toMono = ({ channels, sr }) => {
  if (channels.length === 1) return { channels, sr };
  const m = new Float32Array(channels[0].length);
  for (let i = 0; i < m.length; i++) m[i] = channels.reduce((a, c) => a + c[i], 0) / channels.length;
  return { channels: [m], sr };
};

const CEILING = 0.97;
// Peak limiter with 2 ms lookahead. The gain reduction is linked across channels so the stereo image is preserved.
function limit(chs, sr) {
  const n = chs[0].length, L = Math.max(1, Math.floor(0.002 * sr));
  const need = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    let a = 1e-9;
    for (const c of chs) a = Math.max(a, Math.abs(c[i]));
    need[i] = Math.min(1, CEILING / a);
  }
  const mn = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    let m = 1;
    for (let j = Math.max(0, i - L); j <= Math.min(n - 1, i + L); j++) if (need[j] < m) m = need[j];
    mn[i] = m;
  }
  const gain = new Float32Array(n);
  let acc = 0;
  const win = [];
  for (let i = 0; i < n; i++) {
    acc += mn[i]; win.push(mn[i]);
    if (win.length > 2 * L + 1) acc -= win.shift();
    gain[i] = Math.min(mn[i], acc / win.length);
  }
  return chs.map((c) => c.map((v, i) => v * gain[i]));
}

// Trim to the first hit (lowest latency), fade the tail, match loudness over the first 100 ms, then limit.
function shape({ channels, sr }, [maxSec, targetDb, fadeMs = 60]) {
  const n = channels[0].length;
  let onset = 0;
  while (onset < n && Math.max(...channels.map((c) => Math.abs(c[onset]))) < 0.004) onset++;
  const start = Math.max(0, onset - Math.floor(0.002 * sr));
  const end = Math.min(n, start + Math.floor(maxSec * sr));
  let out = channels.map((c) => c.slice(start, end));
  const len = out[0].length, fade = Math.min(len, Math.floor((fadeMs / 1000) * sr));
  for (const c of out) for (let i = 0; i < fade; i++) c[len - 1 - i] *= i / fade;
  const w = Math.min(len, Math.floor(0.1 * sr));
  let sum = 0;
  for (let i = 0; i < w; i++) { const v = out.reduce((a, c) => a + c[i], 0) / out.length; sum += v * v; }
  const g = Math.pow(10, targetDb / 20) / (Math.sqrt(sum / w) || 1e-9);
  out = out.map((c) => c.map((v) => v * g));
  return { channels: limit(out, sr), sr };
}

function writeWav(file, { channels, sr }) {
  const ch = channels.length, n = channels[0].length;
  const pcm = Buffer.alloc(44 + n * ch * 2);
  pcm.write('RIFF', 0); pcm.writeUInt32LE(36 + n * ch * 2, 4); pcm.write('WAVEfmt ', 8);
  pcm.writeUInt32LE(16, 16); pcm.writeUInt16LE(1, 20); pcm.writeUInt16LE(ch, 22);
  pcm.writeUInt32LE(sr, 24); pcm.writeUInt32LE(sr * ch * 2, 28); pcm.writeUInt16LE(ch * 2, 32); pcm.writeUInt16LE(16, 34);
  pcm.write('data', 36); pcm.writeUInt32LE(n * ch * 2, 40);
  for (let i = 0; i < n; i++) for (let c = 0; c < ch; c++) pcm.writeInt16LE(Math.round(Math.max(-1, Math.min(1, channels[c][i])) * 32767), 44 + (i * ch + c) * 2);
  fs.writeFileSync(file, pcm);
}

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });
const manifest = {
  source: 'Kick, snare and toms: Nishant’s own recordings. Everything else: CC0 demo recordings (VCSL, Karoryfer) via github.com/Nullframe/daw-content',
  groups: [],
};
for (const g of GROUPS) {
  const entry = { id: g.id, label: g.label, note: g.note, demo: !!g.demo, sounds: [] };
  for (const [id, name, tag, source] of g.sounds) {
    const raw = readWav(typeof source === 'string' ? await fetchSource(source) : readLocal(source.nh));
    const shaped = shape(g.stereo ? raw : toMono(raw), g.shape);
    writeWav(path.join(outDir, `${id}.wav`), shaped);
    entry.sounds.push({ id, name, tag, file: `${id}.wav`, seconds: Math.round((shaped.channels[0].length / shaped.sr) * 100) / 100 });
  }
  manifest.groups.push(entry);
  console.log(`${g.id}: ${entry.sounds.length} sounds${g.demo ? ' (demo)' : ''}`);
}
fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`Wrote ${manifest.groups.reduce((n, g) => n + g.sounds.length, 0)} sounds to ${outDir}`);
