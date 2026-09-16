import { test, expect } from '@playwright/test';

test('theme-matched favicon is served from the app icon route', async ({ page }) => {
  const response = await page.request.get('/icon.svg');
  expect(response.ok()).toBe(true);
  expect(response.headers()['content-type']).toContain('image/svg+xml');
  expect(await response.text()).toContain('Rizqy');
});

test('Satoshi is applied as the portfolio typeface', async ({ page }) => {
  await page.goto('/');

  const fontFamily = await page.locator('body').evaluate(element =>
    window.getComputedStyle(element).fontFamily,
  );
  const satoshiLoaded = await page.evaluate(async () => {
    await document.fonts.ready;
    return document.fonts.check('16px "Satoshi"');
  });

  expect(fontFamily).toContain('Satoshi');
  expect(satoshiLoaded).toBe(true);
});

test('portfolio reference layout, navigation, project dialogs and theme work', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Ahmad Rizqy Yourin' })).toBeVisible();
  await expect(page.locator('.profile-photo')).toBeVisible();
  await expect(page.locator('blockquote.thread-embed').first()).toHaveAttribute('data-text-post-permalink', 'https://www.threads.com/@rizqyyourin/post/DdMA4ZCkx53');
  await expect(page.locator('blockquote.thread-embed').nth(1)).toHaveAttribute('data-text-post-permalink', 'https://www.threads.com/@rizqyyourin/post/DdAoaSTHR0r');
  await expect(page.locator('blockquote.thread-embed').nth(2)).toHaveAttribute('data-text-post-permalink', 'https://www.threads.com/@rizqyyourin/post/DcVVIGpE8QE');
  await expect(page.getByRole('link', { name: 'More threads' })).toHaveAttribute('href', 'https://www.threads.net/@rizqyyourin');
  const hero = await page.locator('.hero-copy').boundingBox();
  const photo = await page.locator('.profile-photo-frame').boundingBox();
  expect(photo!.x).toBeGreaterThan(hero!.x + hero!.width);
  await page.getByRole('navigation').getByRole('link', { name: 'Projects', exact: true }).click();
  await expect(page).toHaveURL(/#projects$/);
  const projectUrls = { 'Kohi Cafe': 'https://cafe.yourin.my.id', QPAY: 'https://qpay.yourin.my.id', Ticketin: 'https://ticketin.yourin.my.id' };
  for (const [name, url] of Object.entries(projectUrls)) await expect(page.getByRole('link', { name: `Visit ${name}` })).toHaveAttribute('href', url);
  await expect(page.getByRole('link', { name: 'View CV', exact: true })).toHaveAttribute('href', '/cv/CV ATS_Ahmad Rizqy Yourin_EN.pdf');
  await expect(page.getByRole('link', { name: "Let's connect" })).toHaveAttribute('href', 'mailto:rizqyyourin6@gmail.com');
  await expect(page.getByRole('link', { name: 'Instagram profile' })).toHaveAttribute('href', 'https://www.instagram.com/rizqyyourin');
  await expect(page.getByRole('link', { name: 'Threads profile' })).toHaveAttribute('href', 'https://www.threads.net/@rizqyyourin');
  await page.getByRole('button', { name: 'Switch to dark theme' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: 'Switch to light theme' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.getByRole('link', { name: 'Back to introduction' }).click();
  await expect(page).toHaveURL(/#about$/);
  expect(errors).toEqual([]);
});

test('mobile reflows without overflow and keeps keyboard access', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#about$/);
  const hero = await page.locator('.hero-copy').boundingBox();
  const photo = await page.locator('.profile-photo-frame').boundingBox();
  expect(photo!.y).toBeGreaterThan(hero!.y + hero!.height);
  await expect(page.getByRole('link', { name: 'Visit Kohi Cafe' })).toHaveAttribute('href', 'https://cafe.yourin.my.id');
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});
