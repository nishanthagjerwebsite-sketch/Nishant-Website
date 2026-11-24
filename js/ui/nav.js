// Mobile menu toggle. The current page is marked with aria-current="page" in each HTML file.
export function initNav() {
  const toggle = document.querySelector('.nav__toggle');
  const root = document.documentElement;
  if (!toggle) return;
  const setOpen = (open) => {
    root.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  toggle.addEventListener('click', () => setOpen(!root.classList.contains('nav-open')));
  document.querySelectorAll('.nav__links a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
}
