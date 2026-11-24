import { initNav } from './ui/nav.js';
import { initReveal } from './ui/reveal.js';
import { initMedia } from './ui/media.js';
import { initForms } from './ui/contact.js';
import { initDrumKit } from './drumkit/drum-kit.js';

initNav();
initReveal();
initMedia();
initForms();
initDrumKit();

const year = document.querySelector('[data-year]');
if (year) year.textContent = new Date().getFullYear();
