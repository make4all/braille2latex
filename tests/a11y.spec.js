import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const IMPACT_LEVELS = new Set(['critical', 'serious']);

test.describe('Accessibility', () => {
  test('homepage has no critical/serious violations', async ({ page }) => {
    await page.goto('/');

    const { violations } = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const impactfulViolations = violations.filter(({ impact }) =>
      impact ? IMPACT_LEVELS.has(impact) : false
    );

    expect(impactfulViolations).toEqual([]);
  });
});
