// Builds the SOUND LIBRARY: assets/sounds/library/<id>.wav plus assets/sounds/library/manifest.json.
//
// Kick, snare and toms are Nishant's own recordings; the hi-hat and cymbals are Paiste's recordings of the same models
// (paiste.com Soundroom, © Paiste). All are read from the project's Sounds folder (or the folder in NH_DIR).
// MP3s are decoded with ffmpeg, which must be installed. Sounds keep their stereo image and are only trimmed, loudness-matched and limited. A group with no sounds leaves its
// part silent on the Play page.
//
// Sounds are grouped by the drum or cymbal they belong to; the Play page only lets a sound be dropped onto a part of
// the same group. To add a recording, put it in Sounds and list it in its group below.
// Usage: npm run samples
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const outDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'sounds', 'library');
const NH_DIR = process.env.NH_DIR || path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'Sounds');

// group: id, label, note, shape [max seconds, target loudness dBFS, tail fade ms], sounds [id, name, tag, file in the Sounds folder]
const GROUPS = [
  { id: 'kick', label: 'Kick drum', note: 'Fits the 22″ kick', shape: [1.2, -10.5, 120], sounds: [
    ['kick-d6-hard-1', 'D6 kick', 'Hard 1', 'KICK/HARD D6-001.wav'],
    ['kick-d6-hard-2', 'D6 kick', 'Hard 2', 'KICK/HARD D6-003.wav'],
    ['kick-d6-normal', 'D6 kick', 'Normal', 'KICK/NORMAL D6-002.wav'],
    ['kick-ba19-hard', 'BA19 kick', 'Hard', 'KICK/HARD BA19 -001.wav'],
  ] },
  { id: 'snare', label: 'Snare', note: 'Fits the 14″ snare', shape: [2.0, -10.5, 250], sounds: [
    ['snare-solidus', 'Solidus B', 'Rimshot 3', 'SNARE/SOLIDUS B RIMSHOT 3 .wav'],
  ] },
  { id: 'snare-2', label: 'Side snare', note: 'Fits the black side snare', shape: [2.0, -10.5, 250], sounds: [
    ['side-goblin', 'Goblin C', 'Rimshot', 'SNARE/GOBLIN C RIMSHOT 1.wav'],
    ['side-solidus', 'Solidus B', 'Rimshot 3', 'SNARE/SOLIDUS B RIMSHOT 3 .wav'],
    ['side-atomizer', 'Atomizer C', 'Rimshot', 'SNARE/C ATOMIZER RIMSHOT 1 .wav'],
  ] },
  { id: 'tom-8', label: '8″ tom', note: 'Fits the 8″ rack tom', shape: [3.2, -11, 500], sounds: [
    ['tom-8-1', '8″ tom', 'Hard 1', 'TOMS/8 INCH HARD 1.wav'],
    ['tom-8-2', '8″ tom', 'Hard 2', 'TOMS/8 INCH HARD 2.wav'],
  ] },
  { id: 'tom-10', label: '10″ tom', note: 'Fits the 10″ rack tom', shape: [3.2, -11, 500], sounds: [
    ['tom-10-1', '10″ tom', 'Hard 1', 'TOMS/10 INCH HARD 1.wav'],
    ['tom-10-2', '10″ tom', 'Hard 2', 'TOMS/10 INCH HARD 2.wav'],
  ] },
  { id: 'tom-12', label: '12″ tom', note: 'Fits the 12″ rack tom', shape: [3.2, -11, 500], sounds: [
    ['tom-12-1', '12″ tom', 'Hard 1', 'TOMS/12 INCH HARD 1.wav'],
    ['tom-12-2', '12″ tom', 'Hard 2', 'TOMS/12 INCH HARD 2.wav'],
  ] },
  { id: 'tom-13', label: '13″ tom', note: 'Fits the 13″ rack tom', shape: [3.2, -11, 500], sounds: [
    ['tom-13-1', '13″ tom', 'Hard 1', 'TOMS/13 INCH HARD 1.wav'],
    ['tom-13-2', '13″ tom', 'Hard 2', 'TOMS/13 INCH HARD 2.wav'],
  ] },
  { id: 'tom-16', label: '16″ tom', note: 'Fits the 16″ floor tom', shape: [3.2, -11, 500], sounds: [
    ['tom-16-1', '16″ tom', 'Hard 1', 'TOMS/16 INCH HARD 1.wav'],
    ['tom-16-2', '16″ tom', 'Hard 2', 'TOMS/16 INCH HARD 2.wav'],
  ] },
  { id: 'tom-18', label: '18″ tom', note: 'Fits the 18″ floor tom', shape: [3.2, -11, 500], sounds: [
    ['tom-18-1', '18″ tom', 'Hard 1', 'TOMS/18 INCH HARD 1.wav'],
    ['tom-18-2', '18″ tom', 'Hard 2', 'TOMS/18 INCH HARD 2.wav'],
  ] },
  { id: 'hihat-closed', label: 'Hi-hat closed', note: 'Fits the closed hi-hat', shape: [0.35, -13, 60], sounds: [
    ['hihat-closed', 'Dark Energy Mark I', 'Closed', 'CYMBALS/SIGNATURE DARK ENERGY HATS MARK I 14 - CLOSED.mp3'],
  ] },
  { id: 'hihat-open', label: 'Hi-hat open', note: 'Fits the open hi-hat', shape: [1.8, -13, 60], sounds: [
    ['hihat-open', 'Dark Energy Mark I', 'Open', 'CYMBALS/SIGNATURE DARK ENERGY HATS MARK I 14 - OPEN.mp3'],
  ] },
  { id: 'hihat-foot', label: 'Hi-hat foot', note: 'Fits the hi-hat pedal', shape: [0.35, -13, 60], sounds: [
    ['hihat-foot', 'Dark Energy Mark I', 'Chick', 'CYMBALS/SIGNATURE DARK ENERGY HATS MARK I 14 - CHICK.mp3'],
  ] },
  { id: 'crash', label: 'Crash', note: 'Fits the four crash cymbals', shape: [4.0, -12, 1500], sounds: [
    ['crash-power', 'Power Crash', 'Edge', 'CYMBALS/2002 POWER CRASH 18 - EDGE.mp3'],
    ['crash-wild', 'Wild Crash', 'Edge', 'CYMBALS/2002 WILD CRASH 18 - EDGE.mp3'],
    ['crash-extreme', 'Extreme Crash', 'Edge', 'CYMBALS/2002 EXTREME CRASH 18 - EDGE.mp3'],
    ['crash-purple', 'Purple Crash', 'Edge', 'CYMBALS/COLOR SOUND 900 PURPLE CRASH 16 - EDGE.mp3'],
  ] },
  { id: 'ride', label: 'Ride', note: 'Fits the black ride', shape: [4.0, -13, 1500], sounds: [
    ['ride-body', 'Giga Bell', 'Body', 'CYMBALS/2002 GIGA BELL RIDE PSYCHOCTOPUS 18 - BODY.mp3'],
    ['ride-bell', 'Giga Bell', 'Bell', 'CYMBALS/2002 GIGA BELL RIDE PSYCHOCTOPUS 18 - BELL.mp3'],
    ['ride-edge', 'Giga Bell', 'Edge', 'CYMBALS/2002 GIGA BELL RIDE PSYCHOCTOPUS 18 - EDGE.mp3'],
  ] },
  { id: 'china', label: 'China', note: 'Fits the china cymbal', shape: [4.0, -12, 1500], sounds: [
    ['china-edge', 'Novo China', 'Edge', 'CYMBALS/2002 NOVO CHINA 18 - EDGE.mp3'],
  ] },
  { id: 'splash', label: 'Splash', note: 'Fits the splash cymbal', shape: [2.5, -12, 800], sounds: [
    ['splash-edge', 'Purple Splash', 'Edge', 'CYMBALS/COLOR SOUND 900 PURPLE SPLASH 10 - EDGE.mp3'],
    ['splash-choke', 'Purple Splash', 'Choke', 'CYMBALS/COLOR SOUND 900 PURPLE SPLASH 10 - CHOKE.mp3'],
  ] },
];

function readLocal(rel) {
  const file = path.join(NH_DIR, rel);
  if (!fs.existsSync(file)) throw new Error(`Missing ${file}. Set NH_DIR to the folder that holds KICK, SNARE and TOMS.`);
  if (/\.wav$/i.test(file)) return fs.readFileSync(file);
  return execFileSync('ffmpeg', ['-v', 'error', '-nostdin', '-i', file, '-c:a', 'pcm_f32le', '-f', 'wav', '-fflags', '+bitexact', '-'], { maxBuffer: 1 << 28 });
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
  source: 'Kick, snare and toms: Nishant’s own recordings. Hi-hat and cymbals: © Paiste (paiste.com Soundroom)',
  groups: [],
};
for (const g of GROUPS) {
  const entry = { id: g.id, label: g.label, note: g.note, sounds: [] };
  for (const [id, name, tag, source] of g.sounds) {
    const raw = readWav(readLocal(source));
    const shaped = shape(raw, g.shape);
    writeWav(path.join(outDir, `${id}.wav`), shaped);
    entry.sounds.push({ id, name, tag, file: `${id}.wav`, seconds: Math.round((shaped.channels[0].length / shaped.sr) * 100) / 100 });
  }
  manifest.groups.push(entry);
  console.log(`${g.id}: ${entry.sounds.length} sounds`);
}
fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`Wrote ${manifest.groups.reduce((n, g) => n + g.sounds.length, 0)} sounds to ${outDir}`);
