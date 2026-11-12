const { test, expect } = require('playwright/test');

const BASE_URL = process.env.VISUAL_BASE_URL || 'http://127.0.0.1:4174';
const branches = ['ispanskie', 'prokshino'];
const services = [
  'consultations', 'diagnostics', 'anesthesia', 'hygiene', 'treatment',
  'endodontics', 'surgery', 'implantation', 'prosthetics', 'orthodontics',
];
const doctors = [
  'aram-danielyan', 'azer-nadzhafov', 'diana-fiasheva',
  'anna-karapetyan', 'amina-mashrabova',
];

const PAGES = [
  '/atlas-v4-1/index.html',
  ...branches.flatMap((branch) => [
    `/atlas-v4-1/${branch}/index.html`,
    `/atlas-v4-1/${branch}/directions/index.html`,
    `/atlas-v4-1/${branch}/prices/index.html`,
    `/atlas-v4-1/${branch}/doctors/index.html`,
    `/atlas-v4-1/${branch}/gallery/index.html`,
    `/atlas-v4-1/${branch}/contacts/index.html`,
    `/atlas-v4-1/${branch}/booking/index.html`,
    ...services.map((service) => `/atlas-v4-1/${branch}/services/${service}.html`),
    ...doctors.map((doctor) => `/atlas-v4-1/${branch}/doctors/${doctor}.html`),
  ]),
];

const VIEWPORTS = [
  { width: 390, height: 844 },
  { width: 1440, height: 900 },
];

for (const vp of VIEWPORTS) {
  for (const path of PAGES) {
    test(`no overlay on photos: ${path} @${vp.width}`, async ({ page }) => {
      await page.setViewportSize(vp);
      await page.goto(BASE_URL + path, { waitUntil: 'networkidle' });

      const violations = await page.evaluate(() => {
        const out = [];
        const isVisible = (el) => {
          const s = getComputedStyle(el);
          const r = el.getBoundingClientRect();
          return s.display !== 'none' && s.visibility !== 'hidden' &&
            parseFloat(s.opacity) > 0 && r.width > 0 && r.height > 0;
        };
        const hasOwnText = (el) =>
          [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
        const overlapArea = (a, b) =>
          Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) *
          Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
        const desc = (el) =>
          el.tagName.toLowerCase() +
          (el.className ? '.' + String(el.className).trim().split(/\s+/).join('.') : '');

        const media = [...document.querySelectorAll('img, picture, video')].filter(isVisible);

        for (const bad of document.querySelectorAll('.photo-floating-badge')) {
          out.push('forbidden element in DOM: ' + desc(bad));
        }

        for (const m of media) {
          const mr = m.getBoundingClientRect();
          if (mr.width < 80 || mr.height < 80) continue;

          for (const el of document.body.querySelectorAll('*')) {
            if (el === m || m.contains(el) || el.contains(m)) continue;
            if (!isVisible(el)) continue;
            const isControl = el.matches('button, a, input, [role="button"]');
            if (!hasOwnText(el) && !isControl) continue;
            if (el.closest('[data-gallery-control]')) continue;
            if (overlapArea(mr, el.getBoundingClientRect()) > 4) {
              out.push(`overlap: ${desc(el)} over ${desc(m)} ("${(el.textContent || '').trim().slice(0, 40)}")`);
            }
          }

          let node = m;
          for (let i = 0; i < 3 && node; i++, node = node.parentElement) {
            for (const pseudo of ['::before', '::after']) {
              const c = getComputedStyle(node, pseudo).content;
              if (c && c !== 'none' && c !== 'normal' && c !== '""' && c !== "''") {
                out.push(`pseudo-text ${pseudo} on ${desc(node)}: ${c}`);
              }
            }
          }
        }
        return out;
      });

      expect(violations, violations.join('\n')).toEqual([]);
    });
  }
}

module.exports = { PAGES, VIEWPORTS };
