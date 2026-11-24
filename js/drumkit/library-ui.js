// The sound library, the setup list, and the drag-and-drop between them.
// A sound can only be dropped on a part of the same group; the Play page highlights the valid targets while you drag.
// Dragging uses pointer events (works with mouse and touch; on touch, use the grip handle so the list can still scroll).
// Every row in the setup list also has a dropdown, so keyboard and screen-reader users can change sounds without dragging.
const PLAY_ICON = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M7 4.5v15l13-7.5z" fill="currentColor"/></svg>';
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
export const partName = (p) => (p.size ? `${p.label} ${p.size}` : p.label);

export function initLibraryUI(api, { libraryEl, setupEl, toastEl, sections }) {
  const { groups, sounds, parts } = api;
  const partById = new Map(parts.map((p) => [p.id, p]));
  let toastTimer;

  const toast = (msg, kind = 'info') => {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.dataset.kind = kind;
    toastEl.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-on'), 3400);
  };
  api.toast = toast;

  // ---------------- sound library: tabs, one group at a time, so nothing scrolls ----------------
  const CATS = [
    { id: 'drums', label: 'Drums', match: (g) => /^(kick|snare|tom-)/.test(g.id) },
    { id: 'hats', label: 'Hi-hat', match: (g) => g.id.startsWith('hihat-') },
    { id: 'cymbals', label: 'Cymbals', match: (g) => /^(crash|ride|china|splash)$/.test(g.id) },
  ].map((c) => ({ ...c, groups: groups.filter(c.match) })).filter((c) => c.groups.length);
  const secs = (n) => `${n.toFixed(1)}s`;
  const catOf = (gid) => CATS.find((c) => c.groups.some((g) => g.id === gid));

  libraryEl.innerHTML = `
    <div class="lib-cats" role="tablist" aria-label="Sound categories">${CATS.map((c) => `<button type="button" role="tab" data-cat="${c.id}" id="cat-${c.id}">${esc(c.label)}</button>`).join('')}</div>
    <div class="lib-chips" role="tablist" aria-label="Parts" data-lib-chips></div>
    <div class="lib-panels">${groups.map((g) => `
      <section class="lib-group" id="lib-${g.id}" data-group="${g.id}" role="tabpanel" aria-labelledby="chip-${g.id}" hidden>
        <header>
          <h3>${esc(g.label)}${g.demo ? '<span class="lib-demo">Demo</span>' : ''}</h3>
          <p>${esc(g.note)} · ${g.sounds.length ? `${g.sounds.length} sound${g.sounds.length === 1 ? '' : 's'}` : 'no sounds yet'}</p>
        </header>
        <ul>${g.sounds.map((s) => `
          <li class="snd" data-sound="${s.id}" data-group="${g.id}">
            <button class="snd__play" type="button" aria-label="Preview ${esc(s.name)} ${esc(s.tag)}">${PLAY_ICON}</button>
            <span class="snd__text"><span class="snd__name">${esc(s.name)}</span><span class="snd__tag">${esc(s.tag)}</span></span>
            <span class="snd__dur">${secs(s.seconds || 0)}</span>
            <span class="snd__grip" aria-hidden="true" title="Drag onto a part"></span>
            <span class="snd__used" data-used></span>
          </li>`).join('')}</ul>
      </section>`).join('')}</div>`;

  const catBtns = new Map([...libraryEl.querySelectorAll('[data-cat]')].map((b) => [b.dataset.cat, b]));
  const chipsEl = libraryEl.querySelector('[data-lib-chips]');
  let curCat = null, curGroup = null;

  function showGroup(gid) {
    const g = groups.find((x) => x.id === gid);
    if (!g) return;
    const cat = catOf(gid);
    if (cat !== curCat) {
      curCat = cat;
      catBtns.forEach((b, id) => { b.classList.toggle('is-active', id === cat.id); b.setAttribute('aria-selected', String(id === cat.id)); });
      chipsEl.innerHTML = cat.groups.map((x) => `<button type="button" role="tab" id="chip-${x.id}" data-chip="${x.id}">${esc(x.label)}</button>`).join('');
    }
    chipsEl.querySelectorAll('[data-chip]').forEach((b) => { const on = b.dataset.chip === gid; b.classList.toggle('is-active', on); b.setAttribute('aria-selected', String(on)); });
    libraryEl.querySelectorAll('.lib-group').forEach((el) => { el.hidden = el.dataset.group !== gid; });
    curGroup = gid;
  }
  libraryEl.addEventListener('click', (e) => {
    const c = e.target.closest('[data-cat]');
    if (c) { showGroup(CATS.find((x) => x.id === c.dataset.cat).groups[0].id); return; }
    const k = e.target.closest('[data-chip]');
    if (k) showGroup(k.dataset.chip);
  });
  // arrow keys move between tabs
  libraryEl.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const t = e.target.closest('[data-chip], [data-cat]');
    if (!t) return;
    const list = [...t.parentElement.children];
    const next = list[(list.indexOf(t) + (e.key === 'ArrowRight' ? 1 : -1) + list.length) % list.length];
    next.focus(); next.click(); e.preventDefault();
  });
  // when you pick a part in the setup list, the library jumps to the group that fits it
  api.showGroup = showGroup;
  showGroup(groups[0].id);

  // ---------------- setup list ----------------
  setupEl.innerHTML = sections.map((sec) => `
    <section class="setup-section">
      <h3>${esc(sec.title)}</h3>
      <ul class="setup-list">${sec.parts.map((id) => {
        const p = partById.get(id);
        const keys = p.keys.join(' / ').toUpperCase();
        const has = groups.find((g) => g.id === p.group).sounds.length > 0;
        const opts = groups.find((g) => g.id === p.group).sounds.map((s) => `<option value="${s.id}">${esc(s.name)} · ${esc(s.tag)}</option>`).join('') || '<option value="">No sound yet</option>';
        return `
        <li class="srow" data-part="${p.id}" data-group="${p.group}">
          <div class="srow__name"><strong>${esc(p.label)}</strong>${p.size ? `<span class="srow__size">${esc(p.size)}</span>` : ''}${p.hotspot ? '' : '<span class="srow__note">not in the photo</span>'}</div>
          <kbd class="srow__keys">${keys}</kbd>
          <label class="visually-hidden" for="sel-${p.id}">Sound for ${esc(partName(p))}</label>
          <select id="sel-${p.id}" data-select${has ? '' : ' disabled'}>${opts}</select>
          <button class="srow__play" type="button"${has ? '' : ' disabled'} aria-label="Play ${esc(partName(p))}">${PLAY_ICON}</button>
        </li>`;
      }).join('')}</ul>
    </section>`).join('');

  // ---------------- keep everything in sync with the current assignment ----------------
  function sync() {
    const usedBy = new Map();
    parts.forEach((p) => {
      const snd = api.soundOf(p.id);
      const sid = snd?.id || '';
      setupEl.querySelector(`.srow[data-part="${p.id}"] select`).value = sid;
      if (!usedBy.has(sid)) usedBy.set(sid, []);
      usedBy.get(sid).push(p.size ? `${p.label.replace(/ (closed|open)$/, '')} ${p.size}` : p.label);
      const el = document.querySelector(`.piece[data-piece="${p.id}"]`);
      if (el) el.setAttribute('aria-label', `${partName(p)}, key ${p.keys.join(' or ').toUpperCase()}, ${snd ? `sound: ${snd.name} ${snd.tag}` : 'no sound yet'}`);
    });
    libraryEl.querySelectorAll('.snd').forEach((li) => {
      const list = usedBy.get(li.dataset.sound);
      li.classList.toggle('is-used', !!list);
      li.querySelector('[data-used]').textContent = list ? `On: ${list.join(', ')}` : '';
    });
  }
  api.onChange(sync);
  sync();

  setupEl.addEventListener('change', (e) => {
    const sel = e.target.closest('[data-select]');
    if (!sel) return;
    api.assign(sel.closest('.srow').dataset.part, sel.value, { announce: true });
  });
  setupEl.addEventListener('click', (e) => {
    const b = e.target.closest('.srow__play');
    if (b) api.play(b.closest('.srow').dataset.part);
  });
  // clicking a part on the kit or in the setup list also opens the matching group in the library
  setupEl.addEventListener('focusin', (e) => { const r = e.target.closest('.srow'); if (r) showGroup(r.dataset.group); });
  document.querySelector('.ws-kit')?.addEventListener('pointerdown', (e) => { const el = e.target.closest('.piece'); if (el && !document.documentElement.classList.contains('is-dragging')) showGroup(el.dataset.group); });
  let previewTimer;
  libraryEl.addEventListener('click', (e) => {
    const b = e.target.closest('.snd__play');
    if (!b) return;
    const row = b.closest('.snd');
    api.preview(row.dataset.sound);
    // show which sound is playing for as long as it lasts
    libraryEl.querySelectorAll('.snd.is-playing').forEach((el) => el.classList.remove('is-playing'));
    row.classList.add('is-playing');
    clearTimeout(previewTimer);
    previewTimer = setTimeout(() => row.classList.remove('is-playing'), Math.min((sounds.get(row.dataset.sound).seconds || 1) * 1000, 3000));
  });

  // ---------------- drag and drop ----------------
  let drag = null;
  const targetAt = (x, y) => document.elementFromPoint(x, y)?.closest('.piece, .srow') || null;
  const targetPart = (el) => partById.get(el.dataset.piece || el.dataset.part);

  function endDrag() {
    if (!drag) return;
    document.documentElement.classList.remove('is-dragging');
    document.querySelectorAll('.is-target, .is-over, .is-bad').forEach((el) => el.classList.remove('is-target', 'is-over', 'is-bad'));
    drag.ghost.remove();
    drag.item.classList.remove('is-source');
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerup', onUp);
    window.removeEventListener('pointercancel', onCancel);
    window.removeEventListener('keydown', onKey);
    drag = null;
  }
  function onMove(e) {
    if (!drag) return;
    drag.ghost.style.transform = `translate(${e.clientX + 14}px, ${e.clientY + 14}px)`;
    const t = targetAt(e.clientX, e.clientY);
    if (t !== drag.over) {
      drag.over?.classList.remove('is-over', 'is-bad');
      drag.over = t;
      if (t) t.classList.add(t.dataset.group === drag.group ? 'is-over' : 'is-bad');
      drag.ghost.dataset.ok = t ? String(t.dataset.group === drag.group) : '';
    }
  }
  function onUp(e) {
    if (!drag) return;
    const t = targetAt(e.clientX, e.clientY);
    const { sound, group } = drag;
    endDrag();
    if (!t) return;
    const part = targetPart(t);
    if (t.dataset.group === group) {
      api.assign(part.id, sound.id, { announce: true });
    } else {
      const gname = groups.find((g) => g.id === group).label;
      const fits = parts.filter((p) => p.group === group).map(partName);
      toast(`That’s a ${gname.toLowerCase()} sound, so it can’t go on the ${partName(part).toLowerCase()}. It fits: ${fits.join(', ')}.`, 'warn');
    }
  }
  const onCancel = () => endDrag();
  const onKey = (e) => { if (e.key === 'Escape') endDrag(); };

  libraryEl.addEventListener('pointerdown', (e) => {
    const item = e.target.closest('.snd');
    if (!item || e.target.closest('.snd__play')) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (e.pointerType !== 'mouse' && !e.target.closest('.snd__grip')) return; // touch: only the grip drags, so the list can scroll
    e.preventDefault();
    const sound = sounds.get(item.dataset.sound);
    const group = item.dataset.group;
    const ghost = document.createElement('div');
    ghost.className = 'drag-ghost';
    ghost.innerHTML = `<strong>${esc(sound.name)}</strong><span>${esc(sound.tag)}</span>`;
    ghost.style.transform = `translate(${e.clientX + 14}px, ${e.clientY + 14}px)`;
    document.body.append(ghost);
    item.classList.add('is-source');
    document.documentElement.classList.add('is-dragging');
    document.querySelectorAll(`.piece[data-group="${group}"], .srow[data-group="${group}"]`).forEach((el) => el.classList.add('is-target'));
    drag = { item, sound, group, ghost, over: null };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onCancel);
    window.addEventListener('keydown', onKey);
  });
}
