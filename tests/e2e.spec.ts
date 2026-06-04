import { test, expect } from '@playwright/test';

test.describe('EduVerse AI E2E Workflows', () => {
  
  test('Landing Page renders and live demo streaming operates', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');

    // Check heading
    await expect(page.locator('h1')).toContainText('An AI Education Operating System');

    // Run AI chat demo form
    const demoInput = page.locator('input[placeholder="e.g. explain linear transformations"]');
    await expect(demoInput).toBeVisible();

    await demoInput.fill('explain Dijkstra algorithms');
    await page.locator('button[type="submit"]').click();

    // Check response stream triggers
    const assistantLog = page.locator('text=assistant:');
    await expect(assistantLog).toBeVisible({ timeout: 10000 });
  });

  test('Student Dashboard displays active learning metrics and widgets', async ({ page }) => {
    // Go to student panel
    await page.goto('/dashboard');

    // Verify widgets
    await expect(page.locator('text=Today\'s Learning Queue')).toBeVisible();
    await expect(page.locator('text=Skill Radar Chart')).toBeVisible();
    await expect(page.locator('text=Learning Streak Heatmap')).toBeVisible();

    // Trigger quick study XP award
    const startBtn = page.locator('text=Start').first();
    await startBtn.click();
  });

  test('AI Tutor Socratic mode and math KaTeX formatting operates', async ({ page }) => {
    await page.goto('/tutor');

    // Toggle Socratic Mode
    const socraticToggle = page.locator('text=Socratic Mode');
    await expect(socraticToggle).toBeVisible();

    // Enter math prompt
    const chatInput = page.locator('input[placeholder="Ask a question or upload math expressions..."]');
    await chatInput.fill('Solve quadratic equations $ax^2 + bx + c = 0$');
    await page.locator('button[type="submit"]').click();

    // Check KaTeX math container rendering
    await expect(page.locator('.katex')).toBeVisible({ timeout: 10000 });
  });

  test('Settings Page Accessibility parameters triggers global styling', async ({ page }) => {
    await page.goto('/settings');

    // Toggle OpenDyslexic font
    const dyslexiaToggle = page.locator('text=OpenDyslexic Typography Option');
    await expect(dyslexiaToggle).toBeVisible();
    
    // Toggle on
    await page.locator('button').nth(1).click();
    
    // Check if html body applies font wrapper classlist
    const htmlClass = await page.evaluate(() => document.documentElement.classList.contains('dyslexia-font'));
    expect(htmlClass).toBeTruthy();
  });

});
