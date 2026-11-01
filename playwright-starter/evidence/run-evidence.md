# Run evidence

- Tool: Claude Code; Playwright CLI (керований цикл); `playwright-test-planner` і `playwright-test-generator` (перший прохід)
- Command: `npx playwright test tests/guest-add-car.spec.ts --project=chromium`
- Timestamp: `2026-11-01T09:19:24Z`
- Environment: `Linux x64, Node v24.15.0, Playwright 1.62.1, Chromium, https://qauto.forstudy.space`
- Actual:

```text
Running 1 test using 1 worker

  ✓  1 [chromium] › tests/guest-add-car.spec.ts:8:7 › Guest adds a car to Garage › Guest adds Audi TT to Garage (3.5s)

  1 passed (4.1s)
```

| Елемент | Джерело |
|---|---|
| setup | `baseURL` із `playwright.config.ts`; `page.goto('/')`; вхід через `Guest log in` |
| locator/action | CLI-інспекція поточного UI, сесія `lecture07` (таблиця у `specs/generated-guest-add-car.md`); локатори й дії в `pages/garage.page.ts` |
| assertions | `specs/add-car.md`: URL `/panel/garage`, видимий запис `Audi TT`, пробіг `12000` на картці авто |

## Керований цикл

Цикл повторено з окремими рішеннями людини. Код тесту після CLI-інспекції не змінювався: diff порожній.

| Етап | Рішення людини | Результат |
|---|---|---|
| Специфікація | `APPROVE SPEC` | `specs/generated-guest-add-car.md` |
| CLI-інспекція | `APPROVE CLI INSPECTION` | локатори підтверджено, сесію закрито |
| Запуск | `APPROVE RUN` | вивід у розділі Actual |

## Додаткові перевірки

Перевірки цього розділу виконано раніше, під час перебудови на Page Object. Код відтоді не змінювався.

Стабільність: `npx playwright test tests/guest-add-car.spec.ts tests/guest-garage.spec.ts --project=chromium --repeat-each=3 --retries=0 --reporter=list`

```text
Running 6 tests using 6 workers

  ✓  2 [chromium] › tests/guest-garage.spec.ts:4:5 › guest can open Garage (3.3s)
  ✓  1 [chromium] › tests/guest-garage.spec.ts:4:5 › guest can open Garage (3.3s)
  ✓  5 [chromium] › tests/guest-garage.spec.ts:4:5 › guest can open Garage (4.0s)
  ✓  6 [chromium] › tests/guest-add-car.spec.ts:8:7 › Guest adds a car to Garage › Guest adds Audi TT to Garage (4.0s)
  ✓  3 [chromium] › tests/guest-add-car.spec.ts:8:7 › Guest adds a car to Garage › Guest adds Audi TT to Garage (4.5s)
  ✓  4 [chromium] › tests/guest-add-car.spec.ts:8:7 › Guest adds a car to Garage › Guest adds Audi TT to Garage (4.5s)

  6 passed (5.3s)
```

Здатність тесту падати після перебудови: у тимчасових копіях тесту очікуваний пробіг замінено на `13000`,
очікувану назву на `Audi R8`, а дані `addCar` на модель `R8`. Копії видалено після запуску.

```text
    Error: expect(locator).toHaveValue(expected) failed
    Expected: "13000"
    Received: "12000"
    Error: expect(locator).toBeVisible() failed
    Expected: visible
    Error: element(s) not found
    Error: expect(locator).toBeVisible() failed
    Expected: visible
    Error: element(s) not found
  3 failed
```

## Page Object: перевірки до й після

Сценарії, тестові дані й кількість перевірок не змінились. Локатори перенесено до `pages/garage.page.ts` без змін.

| Тест | До | Після |
|---|---|---|
| guest-add-car | `expect(page).toHaveURL(/\/panel\/garage/)` | без змін |
| guest-add-car | `expect(page.getByText('Audi TT')).toBeVisible()` | `expect(garage.car('Audi TT')).toBeVisible()` |
| guest-add-car | `expect(car.getByRole('spinbutton')).toHaveValue('12000')` | `expect(garage.carMileage('Audi TT')).toHaveValue('12000')` |
| guest-garage | `expect(page).toHaveURL(/panel\/garage/)` | без змін |
| guest-garage | `expect(page.getByRole('heading', { name: /garage/i })).toBeVisible()` | `expect(garage.heading).toBeVisible()` |

- FACTS:
  - Тест пройшов з першої спроби, без використання retry з конфігурації.
  - Перед перебудовою й після неї тести зелені.
  - У тесті три перевірки: URL, видимий запис `Audi TT`, пробіг `12000` на картці цього авто.
  - `playwright.config.ts`, `package.json` і `package-lock.json` не змінювались.
- ASSUMPTIONS:
  - Правила полів узято з Confluence, бо `cases/qauto/requirements/add-car.md` відсутній у проєкті.
- RISKS:
  - `getByText('Audi TT')` прив'язаний до видимого тексту картки: зміна формату назви авто зламає перевірку.
  - Поле пробігу на картці не має доступної назви (R57), тому локатор прив'язаний до картки `Audi TT`. Це також можлива знахідка доступності.
  - Формат дати на картці за планом `dd.mm.yyyy`, а в Confluence `d/m/year` (R48, R56). На тест не впливає.
- HUMAN CORRECTION:
  - Перший прохід виконано за одним загальним дорученням людини, без окремих рішень на кожному етапі.
    Потім людина повторила цикл з окремими `APPROVE SPEC`, `APPROVE CLI INSPECTION` і `APPROVE RUN`.
  - Людина вказала, що `12000` зі `specs/add-car.md` теж треба перевіряти. Перевірку пробігу додано після роботи generator; локатор узято зі snapshot картки.
  - Людина доручила перебудувати все на Page Object, тому змінено й baseline `tests/guest-garage.spec.ts`. Окремого `APPROVE REFACTOR` не було, а керований цикл підтвердив уже перебудований код. Lab-тест навмисно не змінено.
  - ДЗ називає Codex, а локатори перевірено агентами Playwright у Claude Code. Людина обрала цей процес.
  - `AGENTS.md` забороняє агенту push, а людина прямо доручила push.
- DECISION: `ACCEPT` — специфікацію, CLI-інспекцію та фактичний запуск переглянуто людиною
