import type { Locator, Page } from '@playwright/test';

export class GaragePage {
  readonly heading: Locator;

  private readonly page: Page;
  private readonly guestLogInButton: Locator;
  private readonly addCarButton: Locator;
  private readonly brandSelect: Locator;
  private readonly modelSelect: Locator;
  private readonly mileageInput: Locator;
  private readonly addButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /garage/i });
    this.guestLogInButton = page.getByRole('button', { name: /guest log in/i });
    this.addCarButton = page.getByRole('button', { name: 'Add car' });
    this.brandSelect = page.getByRole('combobox', { name: 'Brand' });
    this.modelSelect = page.getByRole('combobox', { name: 'Model' });
    this.mileageInput = page.getByRole('spinbutton', { name: 'Mileage' });
    // "Add" alone also matches "Add car" and "Add fuel expense"
    this.addButton = page.getByRole('dialog').getByRole('button', { name: 'Add', exact: true });
  }

  async openAsGuest(): Promise<void> {
    await this.page.goto('/');
    await this.guestLogInButton.click();
  }

  async addCar(brand: string, model: string, mileage: number): Promise<void> {
    await this.addCarButton.click();
    await this.brandSelect.selectOption(brand);
    await this.modelSelect.selectOption(model);
    await this.mileageInput.fill(String(mileage));
    await this.addButton.click();
  }

  car(name: string): Locator {
    return this.page.getByText(name);
  }

  carMileage(name: string): Locator {
    // The mileage field on a car card has no accessible name, so it is scoped to the card
    return this.page.getByRole('listitem').filter({ hasText: name }).getByRole('spinbutton');
  }
}
