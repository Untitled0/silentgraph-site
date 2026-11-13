import { initDotmark } from './dotmark.js';

// Hero dot-matrix wordmark (index page only)
const hero = document.querySelector('.dotmark');
if (hero) initDotmark(hero);

// Mobile slide-in menu
const navToggle = document.querySelector('.nav-toggle');
const mobileNav = document.querySelector('.mobile-nav');
if (navToggle && mobileNav) {
  const backdrop = document.querySelector('.mobile-nav-backdrop');
  const closeBtn = mobileNav.querySelector('.mobile-nav-close');
  const setOpen = (open) => {
    document.body.classList.toggle('nav-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    mobileNav.setAttribute('aria-hidden', String(!open));
  };
  navToggle.addEventListener('click', () =>
    setOpen(!document.body.classList.contains('nav-open'))
  );
  if (closeBtn) closeBtn.addEventListener('click', () => setOpen(false));
  if (backdrop) backdrop.addEventListener('click', () => setOpen(false));
  mobileNav
    .querySelectorAll('a')
    .forEach((a) => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 760) setOpen(false);
  });
}

// Footer year
const yearEl = document.querySelector('[data-year]');
if (yearEl) yearEl.textContent = new Date().getFullYear();
