// Draws the kit: the photo, plus one hotspot group per part. Each part's own pixels (cut out of the photo)
// pulse or wobble when hit, and a soft gold glow fades over it.
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const SVG_NS = 'http://www.w3.org/2000/svg';
const n1 = (n) => Math.round(n * 10) / 10;

export function flash(part) {
  const { art, glow } = part.view;
  if (glow?.animate) {
    glow.getAnimations().forEach((a) => a.cancel());
    glow.animate([{ opacity: 0 }, { opacity: 1, offset: 0.12 }, { opacity: 0 }], { duration: part.kind === 'cymbal' ? 750 : 450, easing: 'ease-out' });
  }
  if (!art?.animate || reduceMotion.matches) return;
  const frames = part.kind === 'cymbal'
    ? [
      { transform: 'rotate(0) scale(1)' },
      { transform: 'rotate(-2.2deg) scale(1.03)', offset: 0.15 },
      { transform: 'rotate(1.6deg) scale(1.02)', offset: 0.4 },
      { transform: 'rotate(-0.8deg) scale(1.01)', offset: 0.65 },
      { transform: 'rotate(0.3deg) scale(1)', offset: 0.85 },
      { transform: 'rotate(0) scale(1)' },
    ]
    : [{ transform: 'scale(1)' }, { transform: `scale(${part.big ? 1.025 : 1.045})`, offset: 0.2 }, { transform: 'scale(1)' }];
  art.getAnimations().forEach((a) => a.cancel());
  art.animate(frames, { duration: part.kind === 'cymbal' ? 750 : 420, easing: 'ease-out' });
}

export function buildKit(kit, parts, drawOrder) {
  const k = kit.width / kit.ref;
  const photo = `${'kit'}-photo`;
  let defs = `<image id="${photo}" href="${kit.photo}" width="${kit.width}" height="${kit.height}"/>`;
  let body = `<use href="#${photo}"/>`;
  const byId = new Map(parts.map((p) => [p.id, p]));
  for (const id of drawOrder) {
    const part = byId.get(id);
    if (!part?.hotspot) continue;
    const h = part.hotspot;
    const cx = n1(h.cx * k), cy = n1(h.cy * k), rx = n1(h.rx * k), ry = n1(h.ry * k), rot = h.rot || 0;
    const t = rot ? ` transform="rotate(${rot} ${cx} ${cy})"` : '';
    const ring = part.kind === 'ring';
    const ringW = n1(Math.max(14, rx * 0.16));
    const cp = `kit-cp-${id}`;
    if (!ring) defs += `<clipPath id="${cp}"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"${t}/></clipPath>`;
    body += `<g class="piece piece--${part.kind}" data-piece="${id}" data-group="${part.group}" role="button" tabindex="0" aria-label="${part.label} ${part.size}, key ${part.keys.join(' or ').toUpperCase()}">`
      + (ring ? '' : `<g class="art" clip-path="url(#${cp})" style="transform-box:view-box;transform-origin:${cx}px ${cy}px"><use href="#${photo}"/></g>`)
      + `<ellipse class="glow${ring ? ' glow--ring' : ''}" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"${t}${ring ? ` stroke-width="${ringW}"` : ''}/>`
      + `<ellipse class="hot${ring ? ' hot--ring' : ''}" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"${t}${ring ? ` stroke-width="${ringW + 12}"` : ''}/>`
      + `</g>`;
  }
  return `<svg xmlns="${SVG_NS}" viewBox="0 0 ${kit.width} ${kit.height}" role="group" aria-label="${kit.name}, ${kit.finish}. ${kit.alt}" focusable="false" style="--ks:${n1(kit.width / 38)}px"><defs>${defs}</defs>${body}</svg>`;
}
