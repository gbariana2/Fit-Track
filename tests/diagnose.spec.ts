import { test, expect } from '@playwright/test';

test('verify year of seed data across all views', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForTimeout(500);

  await page.click('text=Load Demo Data');
  await page.waitForTimeout(1500);

  // Check data volume
  const state = await page.evaluate(() => {
    const raw = localStorage.getItem('workout-tracker-data');
    if (!raw) return null;
    const s = JSON.parse(raw);
    const exerciseNames = new Set<string>();
    for (const w of s.workouts) {
      for (const ex of w.exercises) exerciseNames.add(ex.name);
    }
    return {
      workouts: s.workouts?.length,
      templates: s.templates?.length,
      exercises: exerciseNames.size,
    };
  });
  console.log('Seed data:', JSON.stringify(state));

  // Home
  await page.screenshot({ path: 'test-results/year-home.png', fullPage: true });

  // Progress — score view (ALL time)
  await page.goto('/progress');
  await page.waitForTimeout(1000);
  await page.click('text=ALL');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'test-results/year-score-all.png', fullPage: false });

  // Progress — exercise view, Bench Press, ALL time
  await page.click('text=By Exercise');
  await page.waitForTimeout(300);
  await page.locator('select').selectOption('Bench Press');
  await page.click('text=ALL');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'test-results/year-bench-all.png', fullPage: false });

  // Progress — Squat
  await page.locator('select').selectOption('Squat');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'test-results/year-squat-all.png', fullPage: false });

  // Progress — muscle group, ALL time
  await page.click('text=By Muscle Group');
  await page.click('text=ALL');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'test-results/year-muscle-all.png', fullPage: false });
});
