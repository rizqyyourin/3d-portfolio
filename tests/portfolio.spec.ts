import { test, expect } from '@playwright/test';

test('scroll journey changes scenes and keeps project details accessible', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  const asset = page.waitForResponse(r => r.url().endsWith('/models/macbook.glb'));
  await page.goto('/');
  expect((await asset).ok()).toBe(true);
  await expect(page.getByRole('status')).toHaveCount(0, { timeout: 20000 });
  await expect(page.getByRole('alert', { name: '3D loading error' })).toHaveCount(0);
  await expect(page.locator('main')).toHaveAttribute('data-chapter', 'Enter');
  await page.screenshot({ path: 'test-results/immersive-desktop.png' });
  await page.mouse.wheel(0, 1300);
  await expect(page.locator('main')).toHaveAttribute('data-chapter', 'Work');
  await page.getByRole('button', { name: 'Go to Work', exact: true }).click();
  await expect(page.getByRole('button', { name: 'OPEN PROJECT', exact: false })).toHaveCount(3);
  await page.getByRole('button', { name: 'OPEN PROJECT', exact: false }).first().click();
  await expect(page.getByRole('dialog')).toContainText('schema-based tenant isolation');
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Go to Stack', exact: true }).click();
  await expect(page.locator('main')).toHaveAttribute('data-chapter', 'Stack');
  await expect(page.getByRole('button', { name: 'TypeScript', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Pause ambient motion' }).click();
  await page.getByRole('button', { name: 'TypeScript', exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText('Kubernetes');
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Go to Journey', exact: true }).click();
  await expect(page.locator('main')).toHaveAttribute('data-chapter', 'Journey');
  await page.getByRole('button', { name: 'Explore the journey', exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText('GPA 3.64 / 4.00');
  await page.locator('summary').filter({ hasText: 'Certifications' }).click();
  await expect(page.getByText('Oracle Database Foundation', { exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Go to Connect', exact: true }).click();
  await expect(page.locator('main')).toHaveAttribute('data-chapter', 'Connect');
  await page.getByRole('button', { name: 'Start a conversation', exact: true }).click();
  await expect(page.getByRole('link', { name: 'rizqyyourin6@gmail.com' })).toHaveAttribute('href', 'mailto:rizqyyourin6@gmail.com');
  await page.keyboard.press('Escape');
  expect(errors).toEqual([]);
});

test('mobile menu, scene cards and reduced motion navigation work', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.getByRole('status')).toHaveCount(0, { timeout: 20000 });
  await expect(page.getByRole('alert', { name: '3D loading error' })).toHaveCount(0);
  await page.screenshot({ path: 'test-results/immersive-mobile.png' });
  await expect(page.locator('.scene-tools')).toBeHidden();
  await page.getByRole('button', { name: 'Open chapter menu' }).click();
  await page.getByRole('navigation', { name: 'Chapter index' }).getByRole('button', { name: '02 Work' }).click();
  await expect(page.locator('main')).toHaveAttribute('data-chapter', 'Work');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await page.getByRole('button', { name: 'OPEN PROJECT', exact: false }).nth(1).click();
  await expect(page.getByRole('dialog')).toContainText('MobileNetV2');
  await page.getByRole('button', { name: 'Close details' }).click();
  await page.getByRole('button', { name: 'Go to Journey', exact: true }).click();
  await expect(page.locator('.milestone')).toHaveCount(3);
  await page.waitForTimeout(1000);
  const cards=await page.locator('.milestone').evaluateAll(nodes=>nodes.map(n=>{const r=n.getBoundingClientRect();return {top:r.top,bottom:r.bottom,left:r.left,right:r.right}}));
  for(let i=0;i<cards.length;i++){
    expect(cards[i].left).toBeGreaterThanOrEqual(0);
    expect(cards[i].right).toBeLessThanOrEqual(390);
    if(i)expect(cards[i].top-cards[i-1].bottom).toBeGreaterThan(8);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('model loading failure provides retry and content access', async ({ page }) => {
  await page.route('**/models/macbook.glb', route => route.abort());
  await page.goto('/');
  await expect(page.getByRole('alert', {name: '3D loading error'})).toContainText('couldn’t load', { timeout: 20000 });
  await page.getByRole('button', { name: 'Explore work', exact: false }).click();
  await expect(page.getByRole('dialog')).toContainText('Ideas, made real.');
});

test('work chapter CTA opens the resume directly', async ({ page }) => {
  await page.route('https://resume.yourin.my.id/**', route => route.fulfill({ status: 200, contentType: 'text/html', body: '<title>Resume</title>' }));
  await page.goto('/');
  await expect(page.getByRole('status')).toHaveCount(0, { timeout: 20000 });
  await page.getByRole('button', { name: 'Go to Work', exact: true }).click();
  await expect(page.locator('main')).toHaveAttribute('data-chapter', 'Work');
  await page.getByRole('button', { name: 'Open my resume', exact: true }).click();
  await expect(page).toHaveURL('https://resume.yourin.my.id/');
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('enter chapter CTA opens the resume directly', async ({ page }) => {
  await page.route('https://resume.yourin.my.id/**', route => route.fulfill({ status: 200, contentType: 'text/html', body: '<title>Resume</title>' }));
  await page.goto('/');
  await expect(page.getByRole('status')).toHaveCount(0, { timeout: 20000 });
  await expect(page.locator('main')).toHaveAttribute('data-chapter', 'Enter');
  await page.getByRole('button', { name: 'Visit my resume', exact: true }).click();
  await expect(page).toHaveURL('https://resume.yourin.my.id/');
  await expect(page.getByRole('dialog')).toHaveCount(0);
});
