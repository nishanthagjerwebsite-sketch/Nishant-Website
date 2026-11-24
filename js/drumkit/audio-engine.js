// Web Audio engine: cached sample decoding, polyphonic one-shot voices, choke groups, master volume.
// Output makeup gain: the samples are loudness-matched, and the compressor/limiter downstream catches peaks.
const MAKEUP = 1.4;

export class AudioEngine {
  constructor() {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    this.supported = !!Ctx;
    if (!this.supported) return;
    this.ctx = new Ctx({ latencyHint: 'interactive' });
    this.master = this.ctx.createGain();
    const limiter = this.ctx.createDynamicsCompressor();
    limiter.threshold.value = -3;
    limiter.knee.value = 6;
    limiter.ratio.value = 10;
    limiter.attack.value = 0.002;
    limiter.release.value = 0.15;
    this.master.connect(limiter).connect(this.ctx.destination);
    this.buffers = new Map(); // url -> AudioBuffer (decoded)
    this.pending = new Map(); // url -> Promise<AudioBuffer|null>
    this.voices = new Map();  // partId -> Set(voice)
    this.volume = 0.9;
    this.muted = false;
    this.#applyGain();
  }

  // Fetch and decode once; later calls reuse the result. Resolves null if the file can't be loaded.
  load(url) {
    if (!this.supported) return Promise.resolve(null);
    if (this.buffers.has(url)) return Promise.resolve(this.buffers.get(url));
    if (!this.pending.has(url)) {
      this.pending.set(url, (async () => {
        try {
          const res = await fetch(url);
          if (!res.ok) throw new Error(res.status);
          const data = await res.arrayBuffer();
          // Callback form works on older Safari as well as modern browsers.
          const buf = await new Promise((ok, fail) => this.ctx.decodeAudioData(data, ok, fail));
          this.buffers.set(url, buf);
          return buf;
        } catch (err) {
          console.warn(`Could not load sound "${url}"`, err);
          this.pending.delete(url);
          return null;
        }
      })());
    }
    return this.pending.get(url);
  }

  // Call from a user gesture; safe to call repeatedly.
  unlock() {
    if (this.supported && this.ctx.state !== 'running') this.ctx.resume().catch(() => {});
  }

  // Every hit is a new voice, so rapid hits overlap instead of cutting off. `partId` is the choke key.
  play(partId, buffer, { chokes = [], gain = 1 } = {}) {
    if (!this.supported || !buffer) return;
    this.unlock();
    chokes.forEach((target) => this.choke(target));
    const src = this.ctx.createBufferSource();
    const g = this.ctx.createGain();
    src.buffer = buffer;
    g.gain.value = gain;
    src.connect(g).connect(this.master);
    const set = this.voices.get(partId) || new Set();
    this.voices.set(partId, set);
    const voice = { src, g };
    set.add(voice);
    src.onended = () => { set.delete(voice); src.disconnect(); g.disconnect(); };
    src.start();
  }

  choke(partId) {
    const set = this.voices.get(partId);
    if (!set) return;
    const now = this.ctx.currentTime;
    set.forEach(({ src, g }) => {
      g.gain.cancelScheduledValues(now);
      g.gain.setTargetAtTime(0, now, 0.012);
      try { src.stop(now + 0.08); } catch { /* already stopped */ }
    });
  }

  setVolume(v) { this.volume = v; this.#applyGain(); }
  setMuted(m) { this.muted = m; this.#applyGain(); }
  #applyGain() {
    if (!this.supported) return;
    this.master.gain.setTargetAtTime(this.muted ? 0 : this.volume * MAKEUP, this.ctx.currentTime, 0.01);
  }
}
