# Специфікація: Guest adds a car to Garage

Статус: `APPROVE SPEC` і `APPROVE CLI INSPECTION` отримано від людини, CLI-інспекцію виконано. Створено на етапі 1 керованого циклу, UI на цьому етапі не відкривався.

## Обсяг

Один UI-тест у Chromium: `tests/guest-add-car.spec.ts`.

## Передумова

Нова сесія браузера без гостьових даних. Старт через `baseURL` із `playwright.config.ts`.

Джерело: `specs/add-car.md`, розділ «Межі».

## Тестові дані

| Поле | Значення | Джерело |
|---|---|---|
| Brand | `Audi` | `specs/add-car.md` |
| Model | `TT` | `specs/add-car.md` |
| Mileage | `12000` | `specs/add-car.md` |

## Кроки

| № | Крок | Джерело |
|---|---|---|
| 1 | Увійти через `Guest log in` | `specs/add-car.md` |
| 2 | Відкрити форму `Add car` | `specs/add-car.md` |
| 3 | Обрати Brand `Audi` | `specs/add-car.md` |
| 4 | Обрати Model `TT` | `specs/add-car.md` |
| 5 | Ввести Mileage `12000` | `specs/add-car.md` |
| 6 | Зберегти форму | `specs/add-car.md` |

## Очікуваний результат

| № | Перевірка | Джерело | Статус |
|---|---|---|---|
| E1 | URL містить `/panel/garage` | `specs/add-car.md`, `specs/guest-garage.md` | FACT |
| E2 | Запис `Audi TT` видимий у Garage | `specs/add-car.md` | FACT |
| E3 | Пробіг цього авто дорівнює `12000` | вказівка людини; Confluence, сторінка `User garage`, поле `Mileage value` | ASSUMPTION |

## ASSUMPTION: чого немає у `specs/add-car.md`

- **A1 (E3):** `specs/add-car.md` називає `12000` тестовими даними, але перелічує перевірки лише URL і `Audi TT`.
  Перевірку пробігу додано за вказівкою людини.
- **A2:** тест використовує Page Object із `pages/garage.page.ts`. Це вказівка людини, а не вимога `specs/add-car.md`.
- **A3:** правила полів взято з Confluence, бо `cases/qauto/requirements/add-car.md` відсутній у проєкті.

## Межі

- Без registration, API-викликів, credentials, Fuel Expenses та інших сценаріїв.
- Без fixed waits, довгих CSS або XPath, `first`/`nth` без пояснення.
- Config, dependencies і product code не змінюються.
- Ознаки UI-елементів не задані цією специфікацією: їх підтверджує CLI-інспекція поточного UI.

## CLI-інспекція поточного UI

Сесія `lecture07`, 2026-11-01. Команди: `open`, `snapshot`, `click`, `select`, `fill`, `generate-locator`, `close`.

| Елемент | `generate-locator` | Локатор у `pages/garage.page.ts` | Висновок |
|---|---|---|---|
| Guest log in | `getByRole('button', { name: 'Guest log in' })` | `getByRole('button', { name: /guest log in/i })` | той самий елемент |
| Add car | `getByRole('button', { name: 'Add car' })` | ідентичний | збігається |
| Заголовок Garage | `getByRole('heading', { name: 'Garage' })` | `getByRole('heading', { name: /garage/i })` | той самий елемент |
| Brand | `getByLabel('Brand')` | `getByRole('combobox', { name: 'Brand' })` | роль і назву підтверджено snapshot |
| Model | `getByLabel('Model')` | `getByRole('combobox', { name: 'Model' })` | роль і назву підтверджено snapshot |
| Mileage у формі | `getByRole('spinbutton', { name: 'Mileage' })` | ідентичний | збігається |
| Add | `getByRole('button', { name: 'Add' })` | `getByRole('dialog').getByRole('button', { name: 'Add', exact: true })` | у коді вужче, див. RISK |
| Назва авто | `getByText('Audi TT')` | ідентичний | збігається |
| Пробіг на картці | `getByRole('spinbutton')` | той самий локатор у межах `listitem` з `Audi TT` | у коді вужче, див. RISK |

- **RISK:** `name: 'Add'` без `exact` може збігатися також з `Add car` і `Add fuel expense`, тому в коді лишено обмеження діалогом.
- **RISK:** поле пробігу на картці без доступної назви, а кнопка редагування авто без текстової назви. Це можливі знахідки доступності.
- **FACT:** після збереження видно `Audi TT`, у полі пробігу `12000`, URL `/panel/garage`.
- **Обмеження інспекції:** snapshot після `fill` не оновився, тому стан кнопки `Add` між `fill` і натисканням цією інспекцією не підтверджено. Натискання спрацювало.
