/*
 * SILENTGRAPH dot-matrix wordmark — generative version.
 *
 * Same method as the original 2026-11-13 program-generated logo:
 * render the wordmark glyphs to an offscreen canvas, sample the pixels
 * onto a regular grid, then draw one round dot per covered cell.
 * Here the dots live in an SVG so they can light up sequentially
 * (left → right sweep) on load, and scale crisply at any size.
 *
 * Usage: <div class="dotmark" data-text="SILENTGRAPH"></div>
 * The container is filled with the generated SVG. A faint full-grid
 * "ghost" layer stays visible behind the glyphs, like the source PNGs.
 */

const FONT_STACK = "'Archivo', 'Helvetica Neue', Arial, sans-serif";
const ROWS = 15;              // glyph height in dots (matches source render)
const SAMPLE_PX = 210;        // offscreen font size used for sampling

function sampleGlyphs(text) {
  const cell = SAMPLE_PX / ROWS;
  const off = document.createElement('canvas');
  const ctx = off.getContext('2d', { willReadFrequently: true });
  ctx.font = `800 ${SAMPLE_PX}px ${FONT_STACK}`;
  const width = Math.ceil(ctx.measureText(text).width);
  off.width = width;
  off.height = SAMPLE_PX * 1.24;
  ctx.font = `800 ${SAMPLE_PX}px ${FONT_STACK}`;
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#000';
  ctx.fillText(text, 0, off.height / 2);

  const cols = Math.ceil(width / cell);
  const rows = Math.ceil(off.height / cell);
  const img = ctx.getImageData(0, 0, off.width, off.height).data;
  const filled = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const px = Math.min(off.width - 1, Math.floor((x + 0.5) * cell));
      const py = Math.min(off.height - 1, Math.floor((y + 0.5) * cell));
      const alpha = img[(py * off.width + px) * 4 + 3];
      if (alpha > 110) filled.push([x, y]);
    }
  }
  return { filled, cols, rows, cell };
}

function buildSVG(text, ink, ghostOpacity) {
  const { filled, cols, rows } = sampleGlyphs(text);
  const U = 10; // svg units per cell
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${cols * U} ${rows * U}`);
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', text);
  svg.classList.add('dotmark-svg');

  // ghost grid — every cell, very faint
  const ghost = document.createElementNS(svgNS, 'g');
  ghost.setAttribute('fill', ink);
  ghost.setAttribute('opacity', String(ghostOpacity));
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const c = document.createElementNS(svgNS, 'circle');
      c.setAttribute('cx', x * U + U / 2);
      c.setAttribute('cy', y * U + U / 2);
      c.setAttribute('r', U * 0.09);
      ghost.appendChild(c);
    }
  }
  svg.appendChild(ghost);

  // glyph dots — start dim, light up in a left→right sweep
  const glyph = document.createElementNS(svgNS, 'g');
  glyph.setAttribute('fill', ink);
  glyph.classList.add('glyph-layer');
  for (const [x, y] of filled) {
    const c = document.createElementNS(svgNS, 'circle');
    c.setAttribute('cx', x * U + U / 2);
    c.setAttribute('cy', y * U + U / 2);
    c.setAttribute('r', U * 0.36);
    c.classList.add('glyph-dot');
    c.style.transitionDelay = `${Math.round(x * 26 + Math.random() * 60)}ms`;
    glyph.appendChild(c);
  }
  svg.appendChild(glyph);
  return svg;
}

export async function initDotmark(el) {
  const text = el.dataset.text || 'SILENTGRAPH';
  const ink = el.dataset.ink || '#161616';
  const ghostOpacity = parseFloat(el.dataset.ghost || '0.14');
  try {
    await document.fonts.load(`800 100px Archivo`);
    await document.fonts.ready;
  } catch (_) {
    /* fall back to whatever font is available */
  }
  const svg = buildSVG(text, ink, ghostOpacity);
  el.appendChild(svg);
  el.classList.add('dotmark-ready');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) {
    svg.classList.add('lit');
  } else {
    requestAnimationFrame(() =>
      requestAnimationFrame(() => svg.classList.add('lit'))
    );
  }
}
