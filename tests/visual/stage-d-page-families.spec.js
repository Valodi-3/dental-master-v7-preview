const { test, expect } = require('playwright/test');

const BASE_URL = process.env.VISUAL_BASE_URL || 'http://127.0.0.1:4174';
const PAGES = [
  '/atlas-v4-1/ispanskie/doctors/index.html',
  '/atlas-v4-1/ispanskie/doctors/amina-mashrabova.html',
  '/atlas-v4-1/ispanskie/services/implantation.html',
  '/atlas-v4-1/ispanskie/prices/index.html',
  '/atlas-v4-1/ispanskie/contacts/index.html',
  '/atlas-v4-1/ispanskie/booking/index.html',
  '/atlas-v4-1/prokshino/doctors/index.html',
  '/atlas-v4-1/prokshino/doctors/amina-mashrabova.html',
  '/atlas-v4-1/prokshino/services/implantation.html',
  '/atlas-v4-1/prokshino/prices/index.html',
  '/atlas-v4-1/prokshino/contacts/index.html',
  '/atlas-v4-1/prokshino/booking/index.html',
];
const VIEWPORTS = [
  { width: 390, height: 844 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
];

for (const viewport of VIEWPORTS) {
  for (const path of PAGES) {
    test('stage D page-family checks: ' + path + ' @' + viewport.width, async ({ page }) => {
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('console', (message) => {
        if (message.type() === 'error') errors.push(message.text());
      });
      await page.setViewportSize(viewport);
      await page.goto(BASE_URL + path, { waitUntil: 'networkidle' });

      const metrics = await page.evaluate(() => {
        const captions = [...document.querySelectorAll('.gallery-photo')].map((figure) => {
          const image = figure.querySelector('img');
          const caption = figure.querySelector('figcaption');
          if (!image || !caption) return { valid: true };
          const imageRect = image.getBoundingClientRect();
          const captionRect = caption.getBoundingClientRect();
          const style = getComputedStyle(caption);
          return {
            valid: captionRect.top >= imageRect.bottom - 1 &&
              style.position === 'static' &&
              parseFloat(style.fontSize) >= 14,
          };
        });
        const fakeSlots = document.querySelectorAll(
          '[data-slot], [data-fake-slot], [data-booking-slot], .fake-slot, .booking-slot, [data-booking-success]',
        ).length;
        const bookingLinks = [...document.querySelectorAll('a[href]')]
          .filter((link) => /online-zapis|tel:/i.test(link.href)).length;
        const nav = document.querySelector('[data-primary-nav]');
        const navRect = nav?.getBoundingClientRect();
        return {
          scrollWidth: document.documentElement.scrollWidth,
          viewportWidth: innerWidth,
          captions,
          fakeSlots,
          bookingLinks,
          navWithinViewport: !navRect || navRect.right <= innerWidth + 1,
        };
      });

      expect(metrics.scrollWidth, JSON.stringify(metrics)).toBeLessThanOrEqual(viewport.width);
      expect(metrics.captions.every((caption) => caption.valid), JSON.stringify(metrics)).toBeTruthy();
      expect(metrics.fakeSlots, JSON.stringify(metrics)).toBe(0);
      if (/contacts|booking/.test(path)) {
        expect(metrics.bookingLinks, JSON.stringify(metrics)).toBeGreaterThan(0);
      }
      if (viewport.width <= 680) {
        const toggle = page.locator('[data-menu-toggle]');
        if (await toggle.count()) {
          await toggle.click();
          await expect(page.locator('[data-primary-nav]')).toHaveClass(/is-open/);
          expect((await page.locator('[data-primary-nav] a').count())).toBeGreaterThan(0);
          expect((await page.locator('[data-primary-nav]').evaluate((nav) => nav.getBoundingClientRect().right)))
            .toBeLessThanOrEqual(viewport.width + 1);
          await page.keyboard.press('Escape');
          await expect(page.locator('[data-primary-nav]')).not.toHaveClass(/is-open/);
        }
      }
      const visibleBooking = page.locator('[data-open-booking]:visible');
      if (await visibleBooking.count()) {
        await visibleBooking.first().click();
        const dialogOpen = await page.locator('[data-booking-dialog]').evaluate((dialog) => dialog.open);
        expect(dialogOpen).toBeTruthy();
        await page.locator('[data-close-booking]').first().click();
      }
      expect(errors, errors.join('\\n')).toEqual([]);
    });
  }
}
