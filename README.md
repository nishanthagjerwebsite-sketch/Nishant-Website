# Nishant Hagjer — Portfolio

Design: colours and type follow anikanilles.com. Palette: near-black (#0C0C0C), white, a soft sand accent (#D8CBA0), sand (#E0D097) and slate (#26282A), with full-colour photography and a film-grain overlay. All colours are CSS variables at the top of `css/styles.css` (the accent variable is still named `--gold` but now holds the soft sand). Type follows anikanilles.com: Bebas Neue for headings, the name, numbers and labels, Open Sans for text and buttons, and Helvetica for the navigation. Bebas Neue and Open Sans load from Google Fonts (self-host them if you want no third-party requests); Helvetica is a system font. The three font stacks are the `--display`, `--serif` and `--nav` variables at the top of `css/styles.css`.

Multi-page portfolio with a playable virtual drum kit and a drag-and-drop sound library. Plain HTML, CSS and vanilla JS (ES modules). No build step, no dependencies.

## Run locally

```bash
npm start            # http://localhost:8000  (built-in server, Node 18+)
# or: python3 -m http.server 8000
```

A server is required (ES modules, audio and kit SVGs are fetched).

## Pages

| Page | Purpose |
| --- | --- |
| `index.html` | Home: hero, intro, selected work, endorsements, kit teaser, bands, courses and contact calls to action |
| `about.html` | Bio, timeline, gear, influences, sources |
| `media.html` | Portfolio: YouTube video grid and projects |
| `play.html` | His Mapex kit, a sound library, and drag-and-drop sound swapping |
| `courses.html` | Coming soon, with an email sign-up |
| `online-lessons.html` | One-on-one online lessons: request form, how it works, what lessons are like |
| `contact.html` | Email form, email address and social links |

Layout follows anikanilles.com: a slim centred top bar of small uppercase links, a full-width hero with a very large title, a rotated "ABOUT" label beside bold justified text, a photo band with a stage-highlights panel, plain rows with buttons (like its dates list), a single row of brand logos and a slim slate footer. Nav and footer are repeated in each file. If you add a page, add it to both on every page.

## Content and sources

Bio facts come from the artist profile PDF the team supplied ("Nishant Hagjer Artist Profile 2025"), his Paiste artist page, Rolling Stone India (2023) and his YouTube channel (listed at the bottom of `about.html`). Anything not on those was left out. The photos in `assets/photos/profile/` were extracted from that PDF (about 450px wide, so they look soft when enlarged); swap in the originals for sharper results.

**Still placeholders** (marked in the HTML):
- Planned course topics on `courses.html`.
- Photos: the images in `assets/photos/` are frames from his own YouTube videos (downloaded thumbnails). Replace them with press photos for a sharper result. `hero.jpg` and `portrait.jpg` are the main ones.

## Videos

Videos on `media.html` are YouTube embeds that load on click (youtube-nocookie). Change `data-youtube-id` on a `.work` card to swap a video, and its thumbnail path (`assets/photos/<id>-hqdefault.jpg`).

## The kit and the sound library

`play.html` has one kit: Nishant's **Mapex Saturn Evolution in Tuscan Yellow**, as his own photo (`assets/kits/mapex-saturn.jpg`) with every drum and cymbal mapped as a clickable hotspot.

**Library panel.** There is no scrolling in it. Choose a category (Drums, Hi-hat, Cymbals), then a part, and that part's sounds are listed. Clicking a part on the kit or in the setup list opens the matching group. Each sound shows its length and, when it is on a part, which part.

**Swapping sounds.** The Sound library lists real drum recordings grouped by the part they fit (kick, snare, cross stick, rack toms, floor toms, hi-hat closed/open/pedal, crash, ride, china, splash). Drag a sound onto a part to change what that part plays. A sound only fits parts of its own group, so a kick sound can't be dropped on the snare: while you drag, the matching parts glow and the rest are dimmed. Each row of "Your setup" also has a dropdown (keyboard and phone friendly) and a play button. Choices are remembered in the browser; "Reset all sounds" restores the defaults. On phones the kit stays pinned while the library scrolls, and the dotted handle is the drag grip.

**Where things live**
- `js/drumkit/kit-config.js`: the kit's parts (size, keys, sound group, hotspot ellipse on the photo). Add `?debug` to the Play page URL (`/play.html?debug`) to outline every hotspot, then nudge the numbers. A part with no hotspot (the 16″ floor tom, which isn't visible in the photo) is still playable from its key and the setup list.
- `assets/sounds/library/`: the sounds plus `manifest.json` (groups and sound names). **To add your own sounds**, drop a WAV in that folder and add an entry to the right group in `manifest.json`. They appear in the library straight away.
- `npm run samples` rebuilds the demo library from the source recordings (edit the `GROUPS` table in `tools/import-samples.js` to change which are included).

**Kick, snare and toms are Nishant's own recordings** (from his `NH` folder): 4 kicks, 3 snares, and two hits for each tom size (8, 10, 12, 13, 14, 16 and 18″). Each tom part only accepts its own size's sounds. `npm run samples` reads them from `~/Downloads/NH`, or from the folder in the `NH_DIR` environment variable, then trims, loudness-matches and limits them (toms stay stereo).

**Everything else is still demo.** The hi-hats, crash, ride, china, splash and cross stick are placeholders (marked *Demo* in the library) until his own recordings arrive. To replace a group, add a `{ nh: 'FOLDER/File.wav' }` source for it in `tools/import-samples.js`, and rerun the script.

**The demo sounds are real CC0 recordings** (no attribution needed): the "Recorded drums" pack from [Nullframe/daw-content](https://github.com/Nullframe/daw-content/releases/tag/drums-recorded-cc0-2026-09-30), built from the Versilian Community Sample Library and Karoryfer Big Rusty / Swirly Drums. Each is trimmed, loudness-matched and limited. The china group uses the closest available recordings (suspended and clash cymbals), and the splash group uses choked cymbals and a triangle; recordings of his own cymbals would replace them nicely.

**Part mapping.** Parts were mapped to the photo by eye: the four rack toms are 8, 10, 12 and 13″ left to right, the two yellow floor toms are 14″ and 18″, the red-burst drum is the 14″ snare and the black drum on the far left is a side snare. If any label is wrong, fix it in `kit-config.js`.

**Home hero.** The name is a row of per-letter spans in `index.html` (`.hn__ch`, each with a `--d` delay). They fade up gently one after another; the animation is in `css/styles.css` under "Name" and is skipped for visitors who prefer reduced motion.

**Part labels.** Hover a part (or tab to it, or tap it on a phone) and a small tag appears above it with its name, size, current sound and key. It sits over the page, not the photo, so the kit stays clean. Put `tip: 'below'` on a part in `kit-config.js` if its label would cover another drum.

Keys: X/Z kick, S/A snare, D/F cross stick, V black snare, 1–4 rack toms, 5–7 floor toms, R/T hi-hat closed, E/W open, C pedal, Y/I crashes, U ride, P china, O/L splashes. Hits fire on press (multi-touch works), overlap, and the closed hi-hat and pedal choke the open hi-hat. Keys are active while the kit is on screen.

## Photos

The hi-res photos from `~/Desktop/nh photos` are resized into `assets/photos/nh/` (Main Pic for site = home hero, About me = About, Journey = home journey section, Selected work = home band and Media banner, Hi Res Picture = Courses and the stage portrait). The hi-res ones also appear in the "Behind the kit" gallery on About. The Hi Res Picture carries a Bengaluru Drum Fest / Sachin Sacz Photography watermark.

## Direct contact

Contact is by email (`nishanthagjer@gmail.com`) and social links; no phone number is published. The forms on Contact, Online Lessons and Courses are sent through [FormSubmit](https://formsubmit.co) to the address in each form’s `action` (handled in `js/ui/contact.js`). FormSubmit emails that address an activation link the first time a form is used; nothing is delivered until it is clicked. Once activated it also supplies a random string that can replace the address in `action`.

## Brand logos

`assets/brands/` holds the endorsement logos shown on the home page (from each brand's own site or Wikimedia): Paiste, Mapex, Audix, Axis, SlapKlatz, Evans, Promark, Hype String and Vratim (the endorsement list in the artist profile PDF), plus Roland V-Drums (added at the team’s request). `cympad.png` and `gibraltar.png` are still in the folder but no longer used. SlapKlatz and Vratim are dark logos, shown as light silhouettes via the `brand--dark` class. They are trademarks of their owners; confirm you are comfortable displaying them, and replace any file with the version the brand supplies.
