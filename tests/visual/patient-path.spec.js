const { test, expect } = require('playwright/test');

const BASE_URL = process.env.VISUAL_BASE_URL || 'http://127.0.0.1:4174';

test('patient path: service → price → doctor → booking', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  await page.goto(`${BASE_URL}/atlas-v4-1/ispanskie/services/implantation.html`, { waitUntil: 'networkidle' });
  await expect(page.locator('h1')).toContainText('имплантация');
  const priceLink = page.locator('.category-actions a[href^="../prices/index.html"]');
  await expect(priceLink).toBeVisible();
  await priceLink.click();
  await expect(page).toHaveURL(/\/ispanskie\/prices\/index\.html(?:#.*)?$/);

  await expect(page.locator('[data-catalog-search]')).toBeVisible();
  await expect(page.locator('[data-catalog-filter="implantation"]')).toBeVisible();
  const doctorsLink = page.locator('footer a[href="../doctors/index.html"]');
  await expect(doctorsLink).toBeVisible();
  await doctorsLink.click();
  await expect(page).toHaveURL(/\/ispanskie\/doctors\/index\.html$/);

  const doctorLink = page.locator('a[href="amina-mashrabova.html"]').first();
  await expect(doctorLink).toBeVisible();
  await doctorLink.click();
  await expect(page).toHaveURL(/\/ispanskie\/doctors\/amina-mashrabova\.html$/);
  await expect(page.locator('h1')).toContainText('Машрабова Амина');

  const bookingButton = page.locator('.doctor-detail-copy [data-open-booking]');
  await expect(bookingButton).toBeVisible();
  await bookingButton.click();
  await expect(page.locator('[data-booking-dialog]')).toHaveAttribute('open', '');
  await expect(page.locator('[data-booking-dialog]')).toContainText('ШАГ 1 · ФИЛИАЛ');
  await expect(page.locator('[data-booking-dialog]')).toContainText('ШАГ 2 · УСЛУГА');
  await expect(page.locator('[data-booking-dialog]')).toContainText('ШАГ 3 · СПОСОБ ЗАПИСИ');
  await expect(page.locator('[data-booking-branch="ispanskie"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-booking-dialog]')).toContainText('Проверенной онлайн-ссылки DentalPRO для этого филиала');
  await expect(page.locator('[data-booking-dialog] a[href^="tel:"]').first()).toBeVisible();
  await expect(page.locator('[data-booking-dialog] a[aria-disabled="true"]')).toBeVisible();

  await page.locator('[data-booking-branch="prokshino"]').click();
  await expect(page.locator('[data-booking-branch="prokshino"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-booking-dialog]')).toContainText('Токен не найден');
  await expect(page.locator('[data-booking-dialog] a[href*="dantist-prokshino.ru/online-zapis"]').first()).toBeVisible();
  await page.locator('[data-booking-branch="ispanskie"]').click();
  await expect(page.locator('[data-booking-branch="ispanskie"]')).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-booking-dialog]')).not.toHaveAttribute('open', '');
});
