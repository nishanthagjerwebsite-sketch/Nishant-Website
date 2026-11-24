import { AudioEngine } from './audio-engine.js';
import { KIT, PARTS, DRAW_ORDER, SETUP_SECTIONS } from './kit-config.js';
import { buildKit, flash } from './kit-view.js';
import { initLibraryUI, partName } from './library-ui.js';

const STORE = 'nh-kit-sounds-v1';
const isTypingTarget = (el) => el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));

export async function initDrumKit() {
  const root = document.querySelector('[data-kit-app]');
  if (!root) return;
  const canvas = root.querySelector('.kit');
  const status = root.querySelector('[data-kit-status]');
  const say = (m) => { if (status) status.textContent = m; };

  // ---- the sound library (real recordings, listed in a manifest) ----
  let manifest;
  try {
    const res = await fetch(`${KIT.library}manifest.json`);
    if (!res.ok) throw new Error(res.status);
    manifest = await res.json();
  } catch (err) {
    console.warn(err);
    say('Could not load the sound library. Check assets/sounds/library/.');
    return;
  }
  const groups = manifest.groups;
  const sounds = new Map();
  groups.forEach((g) => g.sounds.forEach((s) => sounds.set(s.id, { ...s, group: g.id, url: KIT.library + s.file })));

  // ---- which sound is on which part (defaults: the first sound of each group; changes are remembered) ----
  const parts = PARTS.map((p) => ({ ...p, view: { art: null, glow: null, els: [] } }));
  const partById = new Map(parts.map((p) => [p.id, p]));
  const assigned = new Map(parts.map((p) => [p.id, groups.find((g) => g.id === p.group).sounds[0].id]));
  try {
    const saved = JSON.parse(localStorage.getItem(STORE) || '{}');
    Object.entries(saved).forEach(([pid, sid]) => { if (partById.has(pid) && sounds.get(sid)?.group === partById.get(pid).group) assigned.set(pid, sid); });
  } catch { /* storage unavailable: defaults are fine */ }
  const persist = () => { try { localStorage.setItem(STORE, JSON.stringify(Object.fromEntries(assigned))); } catch { /* ignore */ } };

  const engine = new AudioEngine();
  const listeners = new Set();
  const soundOf = (partId) => sounds.get(assigned.get(partId));

  const api = {
    parts, groups, sounds, soundOf,
    onChange: (fn) => listeners.add(fn),
    toast: () => {},
    play(partId) {
      const part = partById.get(partId);
      const snd = soundOf(partId);
      const buf = engine.buffers.get(snd.url);
      if (buf) engine.play(partId, buf, { chokes: part.chokes });
      else engine.load(snd.url).then((b) => b && engine.play(partId, b, { chokes: part.chokes }));
      if (part.view.art || part.view.glow) flash(part);
    },
    preview(soundId) {
      engine.unlock();
      engine.load(sounds.get(soundId).url).then((b) => b && engine.play('preview', b, { chokes: ['preview'] }));
    },
    assign(partId, soundId, { announce = false } = {}) {
      const part = partById.get(partId), snd = sounds.get(soundId);
      if (!part || !snd || snd.group !== part.group) return false; // a sound only fits its own kind of part
      assigned.set(partId, soundId);
      persist();
      listeners.forEach((fn) => fn());
      if (announce) api.toast(`${partName(part)} now plays “${snd.name} · ${snd.tag}”.`, 'ok');
      engine.load(snd.url).then(() => api.play(partId)); // hear it straight away
      return true;
    },
    reset() {
      parts.forEach((p) => assigned.set(p.id, groups.find((g) => g.id === p.group).sounds[0].id));
      persist();
      listeners.forEach((fn) => fn());
      api.toast('Every part is back to its default sound.', 'ok');
    },
  };

  // ---- draw the kit and wire it up ----
  canvas.innerHTML = buildKit(KIT, parts, DRAW_ORDER);
  canvas.classList.add('is-loaded');
  canvas.classList.toggle('debug', new URLSearchParams(location.search).has('debug'));
  const svg = canvas.querySelector('svg');
  const keyMap = new Map();
  parts.forEach((p) => {
    p.keys.forEach((k) => keyMap.set(k, p));
    const el = svg.querySelector(`[data-piece="${p.id}"]`);
    if (!el) return;
    p.view = { art: el.querySelector('.art'), glow: el.querySelector('.glow'), els: [el] };
    // Pointer events: fire on press (no click delay) and support true multi-touch.
    el.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      e.preventDefault();
      api.play(p.id);
    });
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); if (!e.repeat) api.play(p.id); }
    });
  });
  canvas.addEventListener('contextmenu', (e) => e.preventDefault());

  // ---- a subtle label for the part under the pointer or focus: it sits above the part, outside the photo ----
  const tip = document.createElement('div');
  tip.className = 'kit-tip';
  tip.setAttribute('aria-hidden', 'true'); // each part already has an accessible name
  canvas.append(tip);
  let tipTimer;
  const showTip = (part, hideAfter = 0) => {
    if (!part.hotspot) return;
    const h = part.hotspot, k = KIT.width / KIT.ref;
    const cx = h.cx * k, cy = h.cy * k, ry = h.ry * k;
    const snd = soundOf(part.id);
    tip.innerHTML = `<strong>${partName(part)}</strong><span>${snd.name} · ${snd.tag}</span><kbd>${part.keys.join(' / ').toUpperCase()}</kbd>`;
    const above = part.tip ? part.tip === 'above' : (cy - ry) / KIT.height > 0.16; // flip below when near the top edge
    tip.classList.toggle('is-below', !above);
    tip.style.left = `${Math.min(Math.max((cx / KIT.width) * 100, 16), 84)}%`;
    tip.style.top = `${((above ? cy - ry : cy + ry) / KIT.height) * 100}%`;
    tip.classList.add('is-on');
    clearTimeout(tipTimer);
    if (hideAfter) tipTimer = setTimeout(hideTip, hideAfter);
  };
  const hideTip = () => { clearTimeout(tipTimer); tip.classList.remove('is-on'); };
  parts.forEach((p) => p.view.els.forEach((el) => {
    el.addEventListener('pointerenter', (e) => showTip(p, e.pointerType === 'mouse' ? 0 : 1800));
    el.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') hideTip(); });
    el.addEventListener('focus', () => showTip(p));
    el.addEventListener('blur', hideTip);
  }));

  // ---- library + setup list + drag and drop ----
  initLibraryUI(api, {
    libraryEl: document.querySelector('[data-library]'),
    setupEl: document.querySelector('[data-setup]'),
    toastEl: document.querySelector('[data-toast]'),
    sections: SETUP_SECTIONS,
  });

  // ---- keyboard: active while the kit is on screen ----
  let kitVisible = false;
  new IntersectionObserver(([entry]) => { kitVisible = entry.isIntersecting; }, { threshold: 0.2 }).observe(canvas);
  document.addEventListener('keydown', (e) => {
    if (!kitVisible || e.repeat || e.ctrlKey || e.metaKey || e.altKey || isTypingTarget(e.target)) return;
    const part = keyMap.get(e.key.toLowerCase());
    if (!part) return;
    e.preventDefault();
    api.play(part.id);
  });

  // ---- warm up: decode the sounds currently assigned, shortly before the kit scrolls into view ----
  const warm = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    warm.disconnect();
    say(engine.supported ? 'Loading sounds…' : 'Web Audio is not supported in this browser.');
    if (!engine.supported) return;
    Promise.all([...new Set(assigned.values())].map((id) => engine.load(sounds.get(id).url))).then(() => say(''));
  }, { rootMargin: '800px 0px' });
  warm.observe(root);

  // ---- audio unlock on first interaction (autoplay policy) ----
  const unlockEvents = ['pointerdown', 'touchend', 'keydown', 'click'];
  const unlock = () => {
    engine.unlock();
    if (engine.ctx?.state === 'running') unlockEvents.forEach((n) => document.removeEventListener(n, unlock, true));
  };
  unlockEvents.forEach((n) => document.addEventListener(n, unlock, true));

  // ---- controls ----
  const mute = document.querySelector('[data-mute]');
  const volume = document.querySelector('[data-volume]');
  mute?.addEventListener('click', () => {
    const m = mute.getAttribute('aria-pressed') !== 'true';
    mute.setAttribute('aria-pressed', String(m));
    mute.setAttribute('aria-label', m ? 'Unmute' : 'Mute');
    engine.setMuted(m);
  });
  volume?.addEventListener('input', () => {
    engine.setVolume(Number(volume.value));
    if (mute?.getAttribute('aria-pressed') === 'true') mute.click();
  });
  if (volume) engine.setVolume(Number(volume.value));
  document.querySelector('[data-reset]')?.addEventListener('click', () => api.reset());
}
