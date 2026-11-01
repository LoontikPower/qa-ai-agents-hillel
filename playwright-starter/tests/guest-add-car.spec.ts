// spec: specs/guest-add-car-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Guest adds a car to Garage', () => {
  test('Guest adds Audi TT to Garage', async ({ page }) => {
    await page.goto('/');

    // 1. Click button with accessible name 'Guest log in'
    await page.getByRole('button', { name: 'Guest log in' }).click();

    // 2. Click button 'Add car'
    await page.getByRole('button', { name: 'Add car' }).click();

    // 3. Choose Brand 'Audi' in combobox 'Brand'
    await page.getByRole('combobox', { name: 'Brand' }).selectOption('Audi');

    // 4. Choose Model 'TT' in combobox 'Model'
    await page.getByRole('combobox', { name: 'Model' }).selectOption('TT');

    // 5. Enter '12000' in spinbutton 'Mileage'
    await page.getByRole('spinbutton', { name: 'Mileage' }).fill('12000');

    // 6. Click button 'Add' within the dialog
    await page.getByRole('dialog').getByRole('button', { name: 'Add', exact: true }).click();

    await expect(page).toHaveURL(/\/panel\/garage/);
    await expect(page.getByText('Audi TT')).toBeVisible();

    // Mileage on the car card has no accessible name, so it is scoped to the Audi TT card
    const car = page.getByRole('listitem').filter({ hasText: 'Audi TT' });
    await expect(car.getByRole('spinbutton')).toHaveValue('12000');
  });
});
