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

test('theme switch reveals the new theme from the toggle button', async ({ page }) => {
  await page.addInitScript(() => {
    const nativeAnimate = Element.prototype.animate;
    Element.prototype.animate = function (keyframes, options) {
      if (typeof options === 'object' && options?.pseudoElement === '::view-transition-new(root)') {
        (window as typeof window & { themeReveal?: PropertyIndexedKeyframes }).themeReveal = keyframes as PropertyIndexedKeyframes;
      }
      return nativeAnimate.call(this, keyframes, options);
    };
  });
  await page.goto('/');

  await page.getByRole('button', { name: 'Switch to dark theme' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect.poll(() => page.evaluate(() => {
    const clipPath = (window as typeof window & { themeReveal?: PropertyIndexedKeyframes }).themeReveal?.clipPath;
    return Array.isArray(clipPath) ? clipPath.length : 0;
  })).toBe(2);
  await expect(page.getByRole('button', { name: 'Switch to light theme' })).toBeVisible();
});

test('theme switch still works without the View Transition API', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(document, 'startViewTransition', { configurable: true, value: undefined });
  });
  await page.goto('/');

  await page.getByRole('button', { name: 'Switch to dark theme' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('slow images show skeletons while project links remain usable', async ({ page }) => {
  let releaseImages: (() => void) | undefined;
  const imageGate = new Promise<void>(resolve => { releaseImages = resolve; });
  await page.route(url => url.pathname === '/_next/image' && /profile\.png|cafe\.png/.test(url.searchParams.get('url') ?? ''), async route => {
    await imageGate;
    await route.continue();
  });

  try {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.profile-photo-frame .media-skeleton')).toBeVisible();
    await expect(page.locator('.project-cover').first().locator('.media-skeleton')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Visit Kohi Cafe' })).toHaveAttribute('href', 'https://cafe.yourin.my.id');
  } finally {
    releaseImages?.();
  }

  await expect(page.locator('.profile-photo-frame .media-skeleton')).toHaveCount(0);
  await expect(page.locator('.project-cover').first().locator('.media-skeleton')).toHaveCount(0);
});

test('Threads cards show loading skeletons and keep source links available', async ({ page }) => {
  await page.route(url => url.hostname === 'www.threads.com', route => route.abort());
  await page.goto('/');

  await expect(page.locator('.thread-card')).toHaveCount(3);
  await expect(page.locator('.thread-card .thread-skeleton').first()).toBeVisible();
  await expect(page.locator('.thread-card').first().getByRole('link', { name: 'View on Threads' })).toHaveAttribute('href', 'https://www.threads.com/@rizqyyourin/post/DdMA4ZCkx53');
});

test('mobile reflows without overflow and keeps keyboard access', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#about$/);
  const hero = await page.locator('.hero-copy').boundingBox();
  const photo = await page.locator('.profile-photo-frame').boundingBox();
  expect(photo!.y).toBeLessThan(hero!.y);
  await expect(page.getByRole('link', { name: 'Visit Kohi Cafe' })).toHaveAttribute('href', 'https://cafe.yourin.my.id');
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test('small mobile keeps useful content width and a compact reading rhythm', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.route('**/threads.com/**', route => route.abort());
  await page.goto('/');

  const windowBox = await page.locator('.portfolio-window').boundingBox();
  const stackPanel = page.locator('.stack-panel');
  const firstStackGroup = page.locator('.stack-group').first();

  expect(windowBox!.width).toBeGreaterThanOrEqual(304);
  await expect(stackPanel).toHaveCSS('padding-left', '0px');
  await expect(stackPanel).toHaveCSS('display', 'flex');
  expect(await stackPanel.evaluate(element => element.scrollWidth > element.clientWidth)).toBe(true);
  expect((await firstStackGroup.boundingBox())!.width).toBeGreaterThanOrEqual(260);

  for (const action of await page.locator('.hero-actions .button').all()) {
    const box = await action.boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }
});

test('mobile navigation uses an accessible hamburger menu', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const menuButton = page.getByRole('button', { name: 'Open navigation menu' });
  const navigation = page.getByRole('navigation', { name: 'Main navigation' });

  await expect(menuButton).toBeVisible();
  await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  await expect(navigation).toBeHidden();

  await menuButton.click();
  await expect(page.getByRole('button', { name: 'Close navigation menu' })).toHaveAttribute('aria-expanded', 'true');
  await expect(navigation).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(navigation).toBeHidden();
  await expect(menuButton).toBeFocused();

  await menuButton.click();
  await navigation.getByRole('link', { name: 'Projects', exact: true }).click();
  await expect(page).toHaveURL(/#projects$/);
  await expect(navigation).toBeHidden();

  await page.setViewportSize({ width: 1024, height: 844 });
  await expect(menuButton).toBeHidden();
  await expect(navigation).toBeVisible();
});

test('entrance and scroll reveals finish with readable content', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 600 });
  await page.route('**/threads.com/**', route => route.abort());
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Ahmad Rizqy Yourin' })).toHaveCSS('opacity', '1');
  await expect(page.getByRole('link', { name: 'Visit Kohi Cafe' })).toHaveCSS('opacity', '0');
  await page.getByRole('heading', { name: 'Built Projects' }).scrollIntoViewIfNeeded();
  await page.getByRole('link', { name: 'Visit Kohi Cafe' }).scrollIntoViewIfNeeded();
  await expect(page.getByRole('link', { name: 'Visit Kohi Cafe' })).toHaveCSS('opacity', '1');
  await page.getByRole('heading', { name: 'Tech Stack' }).scrollIntoViewIfNeeded();
  await page.locator('.stack-group').first().scrollIntoViewIfNeeded();
  await expect(page.locator('.stack-group').first()).toHaveCSS('opacity', '1');
});
