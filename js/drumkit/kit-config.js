// Nishant's kit: Mapex Saturn Evolution in Tuscan Yellow, as a real photograph with every drum and cymbal mapped.
//
// PARTS: each playable part, its size, the sound GROUP it accepts, its keys, and a hotspot ellipse on the photo
// (centre cx/cy, radii rx/ry, rotation in degrees; measured in a reference image `ref` pixels wide).
// A sound can only be dropped on a part whose `group` matches the sound's group (see assets/sounds/library/manifest.json).
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
  alt: 'Nishant’s Tuscan Yellow Mapex Saturn Evolution drum kit on a rock at sunset, with four rack toms, two floor toms, a 22 inch kick and seven Paiste cymbals',
  library: 'assets/sounds/library/',
  specs: [
    ['Kit', 'Mapex Saturn Evolution, Tuscan Yellow'],
    ['Kick', '22″'],
    ['Snare', '14″'],
    ['Rack toms', '8″, 10″, 12″, 13″'],
    ['Floor toms', '14″, 16″, 18″'],
  ],
};

export const PARTS = [
  // ---- drums ----
  { id: 'kick',      label: 'Kick drum',         size: '22″', group: 'kick',        kind: 'drum', big: true, keys: ['x', 'z'], tip: 'below', hotspot: { cx: 695, cy: 650, rx: 128, ry: 150 } },
  { id: 'snare',     label: 'Snare',             size: '14″', group: 'snare',       kind: 'drum', keys: ['s', 'a'],           hotspot: { cx: 477, cy: 590, rx: 112, ry: 80 } },
  { id: 'snare-rim', label: 'Snare cross stick', size: '14″', group: 'cross-stick', kind: 'ring', keys: ['d', 'f'],           hotspot: { cx: 476, cy: 548, rx: 114, ry: 40 } },
  { id: 'snare-2',   label: 'Black side snare',  size: '',    group: 'snare',       kind: 'drum', keys: ['v'],                hotspot: { cx: 170, cy: 595, rx: 115, ry: 78 } },
  { id: 'tom-8',     label: 'Rack tom',          size: '8″',  group: 'tom-8',    kind: 'drum', keys: ['1'],                hotspot: { cx: 463, cy: 425, rx: 66, ry: 74 } },
  { id: 'tom-10',    label: 'Rack tom',          size: '10″', group: 'tom-10',    kind: 'drum', keys: ['2'],                hotspot: { cx: 618, cy: 420, rx: 78, ry: 86 } },
  { id: 'tom-12',    label: 'Rack tom',          size: '12″', group: 'tom-12',    kind: 'drum', keys: ['3'],                hotspot: { cx: 778, cy: 415, rx: 80, ry: 90 } },
  { id: 'tom-13',    label: 'Rack tom',          size: '13″', group: 'tom-13',    kind: 'drum', keys: ['4'],                hotspot: { cx: 927, cy: 457, rx: 78, ry: 88 } },
  { id: 'floor-14',  label: 'Floor tom',         size: '14″', group: 'tom-14',   kind: 'drum', keys: ['5'],                tip: 'below', hotspot: { cx: 927, cy: 670, rx: 108, ry: 132 } },
  { id: 'floor-16',  label: 'Floor tom',         size: '16″', group: 'tom-16',   kind: 'drum', keys: ['6'] }, // not visible in the photo
  { id: 'floor-18',  label: 'Floor tom',         size: '18″', group: 'tom-18',   kind: 'drum', keys: ['7'],                tip: 'below', hotspot: { cx: 1180, cy: 720, rx: 142, ry: 166 } },
  // ---- hi-hat ----
  { id: 'hihat-closed', label: 'Hi-hat closed', size: '', group: 'hihat-closed', kind: 'cymbal', keys: ['r', 't'], chokes: ['hihat-open'], hotspot: { cx: 340, cy: 282, rx: 62, ry: 28, rot: 6 } },
  { id: 'hihat-open',   label: 'Hi-hat open',   size: '', group: 'hihat-open',   kind: 'cymbal', keys: ['e', 'w'],                       hotspot: { cx: 340, cy: 282, rx: 122, ry: 54, rot: 6 } },
  { id: 'hihat-foot',   label: 'Hi-hat pedal',  size: '', group: 'hihat-foot',   kind: 'drum',   keys: ['c'],      chokes: ['hihat-open'], hotspot: { cx: 340, cy: 842, rx: 38, ry: 58 } },
  // ---- cymbals ----
  { id: 'crash',    label: 'Crash',          size: '', group: 'crash',  kind: 'cymbal', keys: ['y'], hotspot: { cx: 578, cy: 243, rx: 114, ry: 62, rot: 3 } },
  { id: 'crash-2',  label: 'Crash 2',        size: '', group: 'crash',  kind: 'cymbal', keys: ['i'], hotspot: { cx: 838, cy: 248, rx: 108, ry: 60, rot: 4 } },
  { id: 'ride',     label: 'Ride',           size: '', group: 'ride',   kind: 'cymbal', keys: ['u'], hotspot: { cx: 1175, cy: 342, rx: 128, ry: 60, rot: -4 } },
  { id: 'china',    label: 'China',          size: '', group: 'china',  kind: 'cymbal', keys: ['p'], hotspot: { cx: 1009, cy: 318, rx: 101, ry: 48, rot: 3 } },
  { id: 'splash',   label: 'Splash',         size: '', group: 'splash', kind: 'cymbal', keys: ['o'], hotspot: { cx: 160, cy: 370, rx: 105, ry: 28, rot: -3 } },
  { id: 'splash-2', label: 'Splash 2',       size: '', group: 'splash', kind: 'cymbal', keys: ['l'], hotspot: { cx: 1313, cy: 435, rx: 107, ry: 43, rot: -4 } },
];

// Hit-testing order, bottom to top (later parts sit above earlier ones where hotspots overlap).
export const DRAW_ORDER = ['kick', 'floor-14', 'floor-18', 'snare-2', 'snare', 'snare-rim', 'tom-8', 'tom-10', 'tom-12', 'tom-13',
  'splash', 'splash-2', 'china', 'crash', 'crash-2', 'ride', 'hihat-foot', 'hihat-open', 'hihat-closed'];

// Which section of the setup list each part belongs to.
export const SETUP_SECTIONS = [
  { title: 'Drums', parts: ['kick', 'snare', 'snare-rim', 'snare-2', 'tom-8', 'tom-10', 'tom-12', 'tom-13', 'floor-14', 'floor-16', 'floor-18'] },
  { title: 'Hi-hat and cymbals', parts: ['hihat-closed', 'hihat-open', 'hihat-foot', 'crash', 'crash-2', 'ride', 'china', 'splash', 'splash-2'] },
];
