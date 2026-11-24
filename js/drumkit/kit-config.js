// Nishant's kit: Mapex Saturn Evolution in Tuscan Yellow, as a real photograph with every drum and cymbal mapped.
//
// PARTS: each playable part, its size, the sound GROUP it accepts, its keys, and a hotspot ellipse on the photo
// (centre cx/cy, radii rx/ry, rotation in degrees; measured in a reference image `ref` pixels wide).
// A sound can only be dropped on a part whose `group` matches the sound's group (see assets/sounds/library/manifest.json).
// `sound` is the part's default sound; without it the first sound of its group is used.
// `tip: 'below'` puts the hover label under the part instead of above it (used where the label above would cover another drum).
// A part without a hotspot isn't visible in the photo, but can still be played from its key or the setup list.
// Add ?debug to the Play page URL to outline every hotspot when you want to nudge one.
export const KIT = {
  name: 'Mapex Saturn Evolution',
  finish: 'Tuscan Yellow',
  photo: 'assets/kits/mapex-saturn.jpg',
  width: 1448,
  height: 1086,
  ref: 1448,
  alt: 'Nishant’s Tuscan Yellow Mapex Saturn Evolution drum kit on a rock at sunset, with four rack toms, two floor toms, a 22 inch kick seven Paiste cymbals and a pair of hi-hats',
  library: 'assets/sounds/library/',
  specs: [
    ['Kit', 'Mapex Saturn Evolution, Tuscan Yellow'],
    ['Kick', '22″'],
    ['Snare', '14″'],
    ['Rack toms', '8″, 10″, 12″, 13″'],
    ['Floor toms', '16″, 18″'],
  ],
};

export const PARTS = [
  // ---- drums ----
  { id: 'kick',      label: 'Kick drum',         size: '22″', group: 'kick',        kind: 'drum', big: true, keys: ['x', 'z'], tip: 'below', hotspot: { cx: 695, cy: 650, rx: 128, ry: 150 } },
  { id: 'snare',     label: 'Snare',             size: '14″', group: 'snare',       kind: 'drum', keys: ['s', 'a'],           hotspot: { cx: 480, cy: 591, rx: 112, ry: 80 } },
  { id: 'snare-2',   label: 'Black side snare',  size: '',    group: 'snare-2',     kind: 'drum', keys: ['v'],                hotspot: { cx: 168, cy: 595, rx: 115, ry: 78 } },
  // toms, left to right in the photo
  { id: 'tom-8',     label: 'Rack tom',    size: '8″',  group: 'tom-8',  kind: 'drum', keys: ['1'], hotspot: { cx: 465, cy: 428, rx: 66, ry: 75 } },
  { id: 'tom-12',    label: 'Rack tom',    size: '12″', group: 'tom-12', kind: 'drum', keys: ['2'], hotspot: { cx: 619, cy: 421, rx: 78, ry: 88 } },
  { id: 'tom-13',    label: 'Rack tom',    size: '13″', group: 'tom-13', kind: 'drum', keys: ['3'], hotspot: { cx: 780, cy: 418, rx: 80, ry: 90 } },
  { id: 'tom-10',    label: 'Rack tom',    size: '10″', group: 'tom-10', kind: 'drum', keys: ['4'], hotspot: { cx: 930, cy: 457, rx: 78, ry: 88 } },
  { id: 'floor-16',  label: 'Floor tom',   size: '16″', group: 'tom-16', kind: 'drum', keys: ['5'], tip: 'below', hotspot: { cx: 927, cy: 670, rx: 108, ry: 132 } },
  { id: 'floor-18',  label: 'Floor tom',   size: '18″', group: 'tom-18', kind: 'drum', keys: ['7'], tip: 'below', hotspot: { cx: 1183, cy: 718, rx: 142, ry: 166 } },
  // ---- hi-hat ----
  { id: 'hihat-closed', label: 'Hi-hat closed', size: '', group: 'hihat-closed', kind: 'cymbal', keys: ['r', 't'], chokes: ['hihat-open'], hotspot: { cx: 319, cy: 455, rx: 48, ry: 15, rot: -1 } },
  { id: 'hihat-open',   label: 'Hi-hat open',   size: '', group: 'hihat-open',   kind: 'cymbal', keys: ['e', 'w'],                       hotspot: { cx: 319, cy: 460, rx: 98, ry: 32, rot: -1 } },
  { id: 'hihat-foot',   label: 'Hi-hat pedal',  size: '', group: 'hihat-foot',   kind: 'drum',   keys: ['c'],      chokes: ['hihat-open'], hotspot: { cx: 342, cy: 846, rx: 38, ry: 58 } },
  // ---- cymbals ----
  { id: 'splash',   label: 'Color Sound 900 Purple Splash', size: '10″', group: 'splash', sound: 'splash-edge',      kind: 'cymbal', keys: ['o'], hotspot: { cx: 160, cy: 370, rx: 105, ry: 28, rot: -3 } },
  { id: 'crash-3',  label: '2002 Extreme Crash',            size: '18″', group: 'crash',  sound: 'crash-extreme',    kind: 'cymbal', keys: ['q'], hotspot: { cx: 342, cy: 280, rx: 122, ry: 52, rot: 6 } },
  { id: 'crash',    label: '2002 Power Crash',              size: '18″', group: 'crash',  sound: 'crash-power',      kind: 'cymbal', keys: ['y'], hotspot: { cx: 578, cy: 243, rx: 114, ry: 62, rot: 3 } },
  { id: 'crash-2',  label: '2002 Wild Crash',               size: '18″', group: 'crash',  sound: 'crash-wild',       kind: 'cymbal', keys: ['i'], hotspot: { cx: 841, cy: 248, rx: 110, ry: 61, rot: 4 } },
  { id: 'ride',     label: '2002 Giga Bell Ride',           size: '18″', group: 'ride',   sound: 'ride-body',        kind: 'cymbal', keys: ['u'], hotspot: { cx: 1011, cy: 318, rx: 101, ry: 48, rot: 3 } },
  { id: 'china',    label: '2002 Novo China',               size: '18″', group: 'china',  sound: 'china-edge',       kind: 'cymbal', keys: ['p'], hotspot: { cx: 1179, cy: 341, rx: 128, ry: 60, rot: -4 } },
  { id: 'crash-4',  label: 'Color Sound 900 Purple Crash',  size: '16″', group: 'crash',  sound: 'crash-purple',     kind: 'cymbal', keys: ['l'], hotspot: { cx: 1318, cy: 435, rx: 107, ry: 43, rot: -4 } },
];

// Hit-testing order, bottom to top (later parts sit above earlier ones where hotspots overlap).
export const DRAW_ORDER = ['kick', 'floor-16', 'floor-18', 'snare-2', 'snare', 'tom-8', 'tom-12', 'tom-13', 'tom-10',
  'splash', 'crash-4', 'ride', 'crash', 'crash-2', 'crash-3', 'china', 'hihat-foot', 'hihat-open', 'hihat-closed'];

// Which section of the setup list each part belongs to.
export const SETUP_SECTIONS = [
  { title: 'Drums', parts: ['kick', 'snare', 'snare-2', 'tom-8', 'tom-12', 'tom-13', 'tom-10', 'floor-16', 'floor-18'] },
  { title: 'Hi-hat and cymbals', parts: ['hihat-closed', 'hihat-open', 'hihat-foot', 'splash', 'crash-3', 'crash', 'crash-2', 'ride', 'china', 'crash-4'] },
];
