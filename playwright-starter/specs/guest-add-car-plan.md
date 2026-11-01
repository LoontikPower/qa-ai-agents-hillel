# Guest adds a car to Garage

## Application Overview

Test plan for QAuto (baseURL from playwright.config.ts, https://qauto.forstudy.space). Scope is deliberately limited to exactly ONE happy-path scenario (R12, R14): no negative scenarios, Fuel expenses, registration, API calls or credentials. Sources: docs/01-normalized-requirements.md, docs/02-requirements-analysis.md, specs/add-car.md. FACT: locators and names below were confirmed in the live UI via accessibility snapshots. RISK: cases/qauto/requirements/add-car.md is missing (R15); field rules come from Confluence (SPEC-E). Guest data lives only in the browser session (R31, R33), so each test starts from a fresh state (R32). No fixed waits (R22).

## Test Scenarios

### 1. Guest adds a car to Garage

**Seed:** `tests/seed.spec.ts`

#### 1.1. Guest adds Audi TT to Garage

**File:** `tests/guest-add-car/guest-adds-audi-tt.spec.ts`

**Steps:**
  1. Start from the baseURL home page (fresh browser context, as set up by tests/seed.spec.ts). Click button with accessible name 'Guest log in' (page.getByRole('button', { name: 'Guest log in' })).
    - expect: Page URL becomes https://qauto.forstudy.space/panel/garage
    - expect: Heading level 1 'Garage' is visible
    - expect: Text 'You don’t have any cars in your garage' is visible (empty state; note the typographic apostrophe)
  2. Click button 'Add car' (getByRole('button', { name: 'Add car' })).
    - expect: Dialog containing heading level 4 'Add a car' is visible
    - expect: Combobox 'Brand' (options Audi, BMW, Ford, Porsche, Fiat), combobox 'Model' and spinbutton 'Mileage' (with 'km' suffix) are visible
    - expect: Button 'Add' is disabled; buttons 'Cancel' and 'Close' (×) are present
  3. Choose Brand 'Audi' in combobox 'Brand' (getByRole('combobox', { name: 'Brand' }).selectOption('Audi')).
    - expect: Brand shows 'Audi' (it is also the preselected default; the explicit selection is still performed)
  4. Choose Model 'TT' in combobox 'Model' (getByRole('combobox', { name: 'Model' }).selectOption('TT')).
    - expect: Model shows 'TT' (options for Audi: TT, R8, Q7, A6, A8; TT is the default)
  5. Enter '12000' in spinbutton 'Mileage' (getByRole('spinbutton', { name: 'Mileage' }).fill('12000')).
    - expect: Mileage field contains 12000
    - expect: Button 'Add' becomes enabled
  6. Click button 'Add' within the dialog (getByRole('dialog').getByRole('button', { name: 'Add', exact: true })). Note: unscoped getByRole('button', { name: 'Add' }) is ambiguous with 'Add car' and 'Add fuel expense' — use exact or dialog scoping.
    - expect: Dialog closes
    - expect: Page URL still contains /panel/garage (assert with expect(page).toHaveURL(/\/panel\/garage/))
    - expect: Text 'Audi TT' is visible in the Garage list (list item contains paragraph 'Audi TT', e.g. getByText('Audi TT')); the empty-state text is gone
    - expect: Car card shows mileage input value 12000 and 'Update mileage • <today dd.mm.yyyy>' (the mileage value is asserted in the test; the date is informational only)
