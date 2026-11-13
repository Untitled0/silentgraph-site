import { initDotmark } from './dotmark.js';

// Hero dot-matrix wordmark (index page only)
const hero = document.querySelector('.dotmark');
if (hero) initDotmark(hero);

// Footer year
const yearEl = document.querySelector('[data-year]');
if (yearEl) yearEl.textContent = new Date().getFullYear();
