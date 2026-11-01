import { test, expect } from '@playwright/test';
import { GaragePage } from '../pages/garage.page';

test('guest can open Garage', async ({ page }) => {
  const garage = new GaragePage(page);

  await garage.openAsGuest();

  await expect(page).toHaveURL(/panel\/garage/);
  await expect(garage.heading).toBeVisible();
});
