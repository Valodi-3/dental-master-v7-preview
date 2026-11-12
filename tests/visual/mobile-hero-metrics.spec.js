const { test, expect } = require('playwright/test');

const BASE_URL = process.env.VISUAL_BASE_URL || 'http://127.0.0.1:4174';
const PAGES = [
  '/atlas-v4-1/ispanskie/index.html',
  '/atlas-v4-1/prokshino/index.html',
];

for (const path of PAGES) {
  test(`mobile hero metrics: ${path} @390`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(BASE_URL + path, { waitUntil: 'networkidle' });

    const metrics = await page.evaluate(() => {
      const hero = document.querySelector('.home-hero, .welcome-inner');
      const photo = document.querySelector('.welcome-photo img, .home-hero-image img');
      const cta = document.querySelector('[data-hero-cta], .hero-actions-row .button-primary');
      const h1 = document.querySelector('.welcome-copy h1, .home-hero h1');
      const lead = document.querySelector('.welcome-lead, .hero-lead');
      const text = document.querySelector('.welcome-copy, .home-hero-copy');
      const rect = (el) => el?.getBoundingClientRect();
      const h1Rect = rect(h1);
      const photoRect = rect(photo);
      const ctaRect = rect(cta);
      const heroRect = rect(hero);
      const style = text ? getComputedStyle(text) : null;
      return {
        heroHeight: heroRect?.height || 0,
        photoVisibleHeight: photoRect ? Math.max(0, Math.min(photoRect.bottom, innerHeight) - Math.max(photoRect.top, 0)) : 0,
        photoHeight: photoRect?.height || 0,
        ctaTop: ctaRect?.top || 0,
        ctaBottom: ctaRect?.bottom || 0,
        ctaHeight: ctaRect?.height || 0,
        h1FontSize: h1Rect ? parseFloat(getComputedStyle(h1).fontSize) : 0,
        h1Lines: h1Rect ? Math.round(h1Rect.height / parseFloat(getComputedStyle(h1).lineHeight)) : 0,
        leadLines: (() => {
          const r = rect(lead);
          return r ? Math.round(r.height / parseFloat(getComputedStyle(lead).lineHeight)) : 0;
        })(),
        bodyTextSize: style ? parseFloat(style.fontSize) : 0,
        scrollWidth: document.documentElement.scrollWidth,
      };
    });

    expect(metrics.photoVisibleHeight, JSON.stringify(metrics)).toBeGreaterThanOrEqual(340);
    expect(metrics.ctaBottom, JSON.stringify(metrics)).toBeLessThanOrEqual(844);
    expect(metrics.ctaHeight, JSON.stringify(metrics)).toBeGreaterThanOrEqual(48);
    expect(metrics.h1FontSize, JSON.stringify(metrics)).toBeGreaterThanOrEqual(28);
    expect(metrics.h1FontSize, JSON.stringify(metrics)).toBeLessThanOrEqual(34);
    expect(metrics.h1Lines, JSON.stringify(metrics)).toBeLessThanOrEqual(3);
    expect(metrics.leadLines, JSON.stringify(metrics)).toBeLessThanOrEqual(3);
    expect(metrics.bodyTextSize, JSON.stringify(metrics)).toBeGreaterThanOrEqual(16);
    expect(metrics.scrollWidth, JSON.stringify(metrics)).toBeLessThanOrEqual(390);
  });
}
