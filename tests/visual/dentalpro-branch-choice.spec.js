const { test, expect } = require('playwright/test');

const BASE_URL = process.env.VISUAL_BASE_URL || 'http://127.0.0.1:4174';
const CASES = [
  {
    branch: 'ispanskie',
    path: '/atlas-v4-1/ispanskie/services/implantation.html?service=svc_implantation_091#selected-procedure',
    service: 'Внутрикостная дентальная имплантация',
  },
  {
    branch: 'prokshino',
    path: '/atlas-v4-1/prokshino/services/implantation.html?service=svc_implantation_091#selected-procedure',
    service: 'Внутрикостная дентальная имплантация',
  },
];
const VIEWPORTS = [
  { width: 390, height: 844 },
  { width: 768, height: 900 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
];

for (const viewport of VIEWPORTS) {
  for (const entry of CASES) {
    test(`DentalPRO branch handoff: ${entry.branch} @${viewport.width}`, async ({ page }) => {
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('console', (message) => {
        if (message.type() === 'error') errors.push(message.text());
      });

      await page.setViewportSize(viewport);
      await page.goto(BASE_URL + entry.path, { waitUntil: 'networkidle' });
      await page.locator('[data-detail-booking]').click();

      const dialog = page.locator('[data-booking-dialog]');
      await expect(dialog).toHaveAttribute('open', '');
      await expect(dialog.locator('[data-booking-branch="' + entry.branch + '"]')).toHaveAttribute('aria-pressed', 'true');
      await expect(dialog.locator('[data-booking-service]')).toBeVisible();
      await expect(dialog.locator('[data-booking-service]')).toContainText(entry.service);
      await expect(dialog).toContainText('ШАГ 3 · СПОСОБ ЗАПИСИ');

      const initialState = await dialog.evaluate((node) => ({
        branch: node.dataset.selectedBranch,
        scrollWidth: document.documentElement.scrollWidth,
        viewportWidth: innerWidth,
        fakeSlots: node.querySelectorAll('[data-slot], [data-fake-slot], [data-booking-slot], .fake-slot, .booking-slot, [data-booking-success]').length,
      }));
      expect(initialState.branch, JSON.stringify(initialState)).toBe(entry.branch);
      expect(initialState.scrollWidth, JSON.stringify(initialState)).toBeLessThanOrEqual(initialState.viewportWidth);
      expect(initialState.fakeSlots, JSON.stringify(initialState)).toBe(0);

      const otherBranch = entry.branch === 'ispanskie' ? 'prokshino' : 'ispanskie';
      await dialog.locator('[data-booking-branch="' + otherBranch + '"]').click();
      await expect(dialog.locator('[data-booking-branch="' + otherBranch + '"]')).toHaveAttribute('aria-pressed', 'true');
      await expect(dialog.locator('[data-booking-service]')).toContainText(entry.service);

      if (otherBranch === 'ispanskie') {
        await expect(dialog.locator('.booking-choice-online')).toHaveClass(/is-unavailable/);
        await expect(dialog.locator('.booking-choice-online a[aria-disabled="true"]')).toBeVisible();
      } else {
        await expect(dialog.locator('.booking-choice-online')).not.toHaveClass(/is-unavailable/);
        await expect(dialog.locator('.booking-choice-online a[href*="dantist-prokshino.ru\/online-zapis"]')).toBeVisible();
        await expect(dialog.locator('.atlas-4-1-dentalpro-warning')).toContainText('Токен не найден');
      }

      await page.keyboard.press('Escape');
      await expect(dialog).not.toHaveAttribute('open', '');
      expect(errors, errors.join('\n')).toEqual([]);
    });
  }
}
