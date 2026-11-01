// spec: specs/guest-add-car-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { GaragePage } from '../pages/garage.page';

test.describe('Guest adds a car to Garage', () => {
  test('Guest adds Audi TT to Garage', async ({ page }) => {
    const garage = new GaragePage(page);

    await garage.openAsGuest();
    await garage.addCar('Audi', 'TT', 12000);

    await expect(page).toHaveURL(/\/panel\/garage/);
    await expect(garage.car('Audi TT')).toBeVisible();
    await expect(garage.carMileage('Audi TT')).toHaveValue('12000');
  });
});
