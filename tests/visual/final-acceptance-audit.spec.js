const { test, expect } = require('playwright/test');

const BASE_URL = process.env.VISUAL_BASE_URL || 'http://127.0.0.1:4174';
const BRANCHES = [
  { id: 'ispanskie', name: 'Испанские кварталы' },
  { id: 'prokshino', name: 'Прокшино' },
];
const VIEWPORTS = [
  { width: 320, height: 844 },
  { width: 360, height: 844 },
  { width: 390, height: 844 },
  { width: 768, height: 900 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
];

async function openBranchPage(page, branch, path, viewport) {
  await page.setViewportSize(viewport);
  const errors = [];
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`);
  });
  const response = await page.goto(`${BASE_URL}/atlas-v4-1/${branch}/${path}`, { waitUntil: 'networkidle' });
  expect(response?.status(), `${branch}/${path}`).toBe(200);
  expect(await page.title(), `${branch}/${path} title`).toBeTruthy();
  expect(await page.locator('link[rel="canonical"]').count(), `${branch}/${path} canonical`).toBeGreaterThan(0);
  expect(await page.locator('meta[name="description"]').count(), `${branch}/${path} description`).toBeGreaterThan(0);
  const viewportState = await page.evaluate(() => ({
    width: innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    missingAlt: [...document.images].filter((image) => {
      const style = getComputedStyle(image);
      const rect = image.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0 && !image.alt.trim();
    }).length,
    images: [...document.images].filter((image) => {
      const rect = image.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    }).length,
  }));
  expect(viewportState.scrollWidth, `${branch}/${path} horizontal overflow`).toBeLessThanOrEqual(viewportState.width);
  expect(viewportState.missingAlt, `${branch}/${path} missing alt`).toBe(0);
  expect(errors, `${branch}/${path} console errors`).toEqual([]);
  return viewportState;
}

for (const branch of BRANCHES) {
  test(`final acceptance catalog and contact audit: ${branch.id}`, async ({ page }) => {
    await openBranchPage(page, branch.id, 'prices/index.html', { width: 390, height: 844 });
    const total = await page.locator('[data-price-item]').count();
    expect(total, `${branch.id} full catalog count`).toBe(254);
    await expect(page.locator('[data-catalog-count]')).toContainText('254');

    await page.locator('[data-catalog-filter="implantation"]').click();
    await expect(page.locator('[data-catalog-count]')).toContainText('18');
    expect(await page.locator('[data-price-item]:not([hidden])').count(), `${branch.id} implantation filter`).toBe(18);

    await page.locator('[data-catalog-search]').fill('имплантат');
    expect(await page.locator('[data-price-item]:not([hidden])').count(), `${branch.id} search results`).toBeGreaterThan(0);
    const firstRow = page.locator('[data-price-item]:not([hidden])').first();
    await firstRow.locator('.price-summary').click();
    await expect(firstRow.locator('.price-detail')).toBeVisible();

    await page.goto(`${BASE_URL}/atlas-v4-1/${branch.id}/doctors/index.html`, { waitUntil: 'networkidle' });
    const profileLinks = await page.locator('a[href$=".html"]').evaluateAll((nodes) => nodes.map((node) => node.getAttribute('href')).filter(Boolean));
    expect(profileLinks.length, `${branch.id} doctor profile links`).toBeGreaterThan(0);
    expect(await page.locator('img').evaluateAll((nodes) => nodes.every((node) => node.complete && node.naturalWidth > 0)), `${branch.id} doctor images`).toBe(true);
    for (const href of profileLinks) {
      const profileResponse = await page.request.get(`${BASE_URL}/atlas-v4-1/${branch.id}/doctors/${href}`);
      expect(profileResponse.status(), `${branch.id} doctor ${href}`).toBe(200);
    }

    await page.goto(`${BASE_URL}/atlas-v4-1/${branch.id}/gallery/index.html`, { waitUntil: 'networkidle' });
    const galleryImages = page.locator('.gallery-photo img, [data-gallery-item] img');
    expect(await galleryImages.count(), `${branch.id} gallery image count`).toBeGreaterThan(0);
    await expect(galleryImages.first()).toBeVisible();
    await galleryImages.first().click();
    await expect(page.locator('.atlas-4-1-lightbox')).toBeVisible();
    await expect(page.locator('.atlas-4-1-lightbox img')).toHaveAttribute('src', /.+/);
    await page.keyboard.press('Escape');
    await expect(page.locator('.atlas-4-1-lightbox')).toBeHidden();

    await page.goto(`${BASE_URL}/atlas-v4-1/${branch.id}/contacts/index.html`, { waitUntil: 'networkidle' });
    expect(await page.locator('a[href^="tel:"]').count(), `${branch.id} phone`).toBeGreaterThan(0);
    expect(await page.locator('a[href*="yandex.ru/maps"]').count(), `${branch.id} map`).toBeGreaterThan(0);
    expect(await page.locator('a[href*="wa.me"], a[href*="t.me"]').count(), `${branch.id} messenger`).toBeGreaterThan(0);
  });

  for (const viewport of VIEWPORTS) {
    test(`final acceptance responsive smoke: ${branch.id} @${viewport.width}`, async ({ page }) => {
      await openBranchPage(page, branch.id, 'index.html', viewport);
      await page.locator('[data-open-booking]:visible').first().click();
      const dialog = page.locator('[data-booking-dialog]');
      await expect(dialog).toHaveAttribute('open', '');
      await expect(dialog.locator('[data-booking-branch="' + branch.id + '"]')).toHaveAttribute('aria-pressed', 'true');
      const serviceBox = await dialog.locator('.atlas-4-1-booking-service-step').evaluate((node) => ({
        height: node.getBoundingClientRect().height,
        selected: node.classList.contains('has-selection'),
      }));
      expect(serviceBox.selected, `${branch.id} homepage should not invent a service`).toBe(false);
      expect(serviceBox.height, `${branch.id} empty service block @${viewport.width}`).toBeLessThan(160);
      expect(await page.evaluate(() => document.documentElement.scrollWidth), `${branch.id} booking overflow @${viewport.width}`).toBeLessThanOrEqual(viewport.width);
      await page.keyboard.press('Escape');
      await expect(dialog).not.toHaveAttribute('open', '');
    });
  }
}
