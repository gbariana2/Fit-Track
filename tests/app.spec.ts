import { test, expect } from '@playwright/test';

// Helper to seed a user name so we get past the setup screen
async function setupUser(page: import('@playwright/test').Page) {
  await page.evaluate(() => {
    const existing = localStorage.getItem('workout-tracker-data');
    const state = existing ? JSON.parse(existing) : { workouts: [], templates: [], settings: {} };
    state.settings = { ...state.settings, userName: 'Test User', defaultUnit: 'lbs', theme: 'light', overloadMode: 'manageable' };
    localStorage.setItem('workout-tracker-data', JSON.stringify(state));
  });
  await page.reload();
  await page.waitForTimeout(300);
}

// ============================================================
// 1. First-time Setup — name entry screen
// ============================================================
test.describe('First-time Setup', () => {
  test('shows welcome screen and accepts name', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Welcome to FitTrack' })).toBeVisible();
    await expect(page.locator('input[placeholder*="call you"]')).toBeVisible();

    await page.fill('input[placeholder*="call you"]', 'Gurshaan');
    await page.click('text=Get Started');

    // Should now show the greeting
    await expect(page.locator('text=Gurshaan')).toBeVisible();
  });

  test('load demo data button populates all pages', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Welcome to FitTrack' })).toBeVisible();

    await page.click('text=Load Demo Data');

    // Should load directly into the homepage with data
    await expect(page.locator('text=Gurshaan')).toBeVisible();
    await expect(page.locator('text=This Week')).toBeVisible();

    // Templates should be populated
    await page.goto('/templates');
    await expect(page.locator('text=Push A').first()).toBeVisible();
    await expect(page.locator('text=Pull A').first()).toBeVisible();
    await expect(page.locator('text=Legs A').first()).toBeVisible();

    // Progress should have exercise data
    await page.goto('/progress');
    await page.click('text=By Exercise');
    await page.waitForTimeout(300);
    const select = page.locator('select');
    const options = await select.locator('option').count();
    expect(options).toBeGreaterThan(10);

    // Records should show PRs
    await page.goto('/records');
    await expect(page.locator('text=Bench Press').first()).toBeVisible();
  });
});

// ============================================================
// 2. Navigation — verify all page links work
// ============================================================
test.describe('Navigation', () => {
  test('all nav links render correct pages', async ({ page }) => {
    await page.goto('/');
    await setupUser(page);

    // Home should show greeting
    await expect(page.locator('text=Test User')).toBeVisible();

    await page.click('a[href="/log"]');
    await expect(page.getByRole('heading', { name: 'Log Workout' })).toBeVisible();

    await page.click('a[href="/templates"]');
    await expect(page.getByRole('heading', { name: 'Templates', exact: true })).toBeVisible();

    await page.click('a[href="/progress"]');
    await expect(page.getByRole('heading', { name: 'Progress' })).toBeVisible();

    await page.click('a[href="/records"]');
    await expect(page.getByRole('heading', { name: 'Personal Records' })).toBeVisible();

    // FitTrack logo should link back to home
    await page.click('a:has-text("FitTrack")');
    await expect(page.locator('text=Test User')).toBeVisible();
  });
});

// ============================================================
// 3. Page Layout — verify key elements on each page
// ============================================================
test.describe('Page Layout', () => {
  test('homepage shows greeting and suggested plan section', async ({ page }) => {
    await page.goto('/');
    await setupUser(page);
    await expect(page.locator('text=Test User')).toBeVisible();
    // Should show "Ready to train?" since no templates exist
    await expect(page.locator('text=Ready to train?')).toBeVisible();
  });

  test('log page shows growth mode selector and add exercise button', async ({ page }) => {
    await page.goto('/log');
    await expect(page.locator('text=Growth Mode')).toBeVisible();
    await expect(page.locator('text=Add Exercise')).toBeVisible();
    await expect(page.locator('text=Manageable')).toBeVisible();
  });

  test('templates page shows empty state', async ({ page }) => {
    await page.goto('/templates');
    await expect(page.locator('text=No templates yet')).toBeVisible();
  });

  test('progress page shows empty state', async ({ page }) => {
    await page.goto('/progress');
    await expect(page.locator('text=No data yet')).toBeVisible();
  });

  test('records page shows empty state', async ({ page }) => {
    await page.goto('/records');
    await expect(page.locator('text=No records yet')).toBeVisible();
  });
});

// ============================================================
// 4. Template Creation — create Push, Pull, Legs templates
// ============================================================
test.describe('Template Creation', () => {
  test('create Push Day template', async ({ page }) => {
    await page.goto('/templates');
    await page.click('text=New Template');

    await page.fill('input[placeholder*="Push Day"]', 'Push Day');
    await page.fill('input[placeholder*="Chest"]', 'Chest, shoulders, and triceps');

    const exercises = ['Bench Press', 'Incline Bench Press', 'Overhead Press', 'Lateral Raise', 'Tricep Pushdown', 'Overhead Tricep Extension'];
    for (const name of exercises) {
      await page.click('text=Add Exercise');
      await page.fill('input[placeholder="Search exercises..."]', name);
      await page.click(`button:has-text("${name}")`);
    }

    for (const name of exercises) {
      await expect(page.locator(`text=${name}`).first()).toBeVisible();
    }

    await page.click('text=Save Template');
    await expect(page.locator('text=Push Day')).toBeVisible();
  });

  test('create Pull Day template', async ({ page }) => {
    await page.goto('/templates');
    await page.click('text=New Template');

    await page.fill('input[placeholder*="Push Day"]', 'Pull Day');
    await page.fill('input[placeholder*="Chest"]', 'Back and biceps');

    const exercises = ['Deadlift', 'Barbell Row', 'Lat Pulldown', 'Seated Cable Row', 'Barbell Curl', 'Hammer Curl'];
    for (const name of exercises) {
      await page.click('text=Add Exercise');
      await page.fill('input[placeholder="Search exercises..."]', name);
      await page.click(`button:has-text("${name}")`);
    }

    await page.click('text=Save Template');
    await expect(page.locator('text=Pull Day')).toBeVisible();
  });

  test('create Leg Day template', async ({ page }) => {
    await page.goto('/templates');
    await page.click('text=New Template');

    await page.fill('input[placeholder*="Push Day"]', 'Leg Day');
    await page.fill('input[placeholder*="Chest"]', 'Quads, hamstrings, glutes, and calves');

    const exercises = ['Squat', 'Romanian Deadlift', 'Leg Press', 'Leg Curl', 'Leg Extension', 'Calf Raise'];
    for (const name of exercises) {
      await page.click('text=Add Exercise');
      await page.fill('input[placeholder="Search exercises..."]', name);
      await page.click(`button:has-text("${name}")`);
    }

    await page.click('text=Save Template');
    await expect(page.locator('text=Leg Day')).toBeVisible();
  });
});

// ============================================================
// 5. Form Submission — log a workout manually
// ============================================================
test.describe('Workout Logging', () => {
  test('log a workout with exercises and sets', async ({ page }) => {
    await page.goto('/log');

    await page.click('text=Add Exercise');
    await page.fill('input[placeholder="Search exercises..."]', 'Bench Press');
    await page.click('button:has-text("Bench Press")');

    const weightInputs = page.locator('input[type="number"]');
    await weightInputs.nth(0).fill('135');
    await weightInputs.nth(1).fill('10');

    await page.click('text=Add Set');
    await weightInputs.nth(2).fill('155');
    await weightInputs.nth(3).fill('8');

    await page.click('text=Save Workout');
    await expect(page.locator('text=Workout Saved!')).toBeVisible();
  });
});

// ============================================================
// 6. Seed Data — load demo via the app's built-in button
// ============================================================
test.describe('Seed PPL Data', () => {
  test('load demo data populates all pages with 10 weeks of data', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForTimeout(500);

    await page.click('text=Load Demo Data');
    await page.waitForTimeout(1000);

    // Verify homepage
    await expect(page.locator('text=Gurshaan')).toBeVisible();
    await expect(page.locator('text=This Week')).toBeVisible();
    await expect(page.locator('text=Recent Activity')).toBeVisible();

    // Verify templates
    await page.goto('/templates');
    await expect(page.locator('text=Push A').first()).toBeVisible();
    await expect(page.locator('text=Pull A').first()).toBeVisible();
    await expect(page.locator('text=Legs A').first()).toBeVisible();

    // Verify progress — workout score view
    await page.goto('/progress');
    await expect(page.getByRole('button', { name: 'Workout Score' })).toBeVisible();

    // Switch to exercise view and check data
    await page.click('text=By Exercise');
    await page.waitForTimeout(300);
    const select = page.locator('select');
    const options = await select.locator('option').count();
    expect(options).toBeGreaterThan(25);

    // Verify records
    await page.goto('/records');
    await expect(page.locator('text=Bench Press').first()).toBeVisible();
    await expect(page.locator('text=Squat').first()).toBeVisible();
    await expect(page.locator('text=Deadlift').first()).toBeVisible();
  });
});
