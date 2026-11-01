# QAuto: автотест Playwright (ДЗ 7.1)

Тест для сценарію `Guest log in → Add car → Audi → TT → Mileage 12000` на стенді QAuto.

| Що | Де |
|---|---|
| Автотест | [`playwright-starter/tests/guest-add-car.spec.ts`](playwright-starter/tests/guest-add-car.spec.ts) |
| Run evidence | [`playwright-starter/evidence/run-evidence.md`](playwright-starter/evidence/run-evidence.md) |
| Тест-кейс TC-001 | [`playwright-starter/docs/03-test-case.md`](playwright-starter/docs/03-test-case.md) |
| Нормалізовані вимоги | [`playwright-starter/docs/01-normalized-requirements.md`](playwright-starter/docs/01-normalized-requirements.md) |
| Аналіз вимог | [`playwright-starter/docs/02-requirements-analysis.md`](playwright-starter/docs/02-requirements-analysis.md) |
| План від planner | [`playwright-starter/specs/guest-add-car-plan.md`](playwright-starter/specs/guest-add-car-plan.md) |

**Як створено:** нормалізація вимог → аналіз → `playwright-test-planner` → `playwright-test-generator` → запуск.

## Як запустити тести самостійно

### 1. Що потрібно

- Node.js LTS і Git.
- Файл `.playwright/cli.config.json` із LMS-архіву `qauto-playwright-starter.zip`.

### 2. Підготовка

```bash
git clone https://github.com/LoontikPower/qa-ai-agents-hillel.git
cd qa-ai-agents-hillel/playwright-starter
npm ci
npx playwright install chromium
```

Стенд закритий HTTP-авторизацією, а її дані навмисно не зберігаються у Git. Скопіюйте папку
`.playwright` з LMS-архіву до `playwright-starter/`.

Якщо архіву немає, створіть `.playwright/cli.config.json` і підставте дані стенда зі сторінки заняття:

```json
{
  "browser": {
    "contextOptions": {
      "httpCredentials": {
        "username": "REPLACE_USERNAME",
        "password": "REPLACE_PASSWORD"
      }
    }
  }
}
```

### 3. Перевірка середовища

```bash
npm run preflight
```

Мають бути рядки `HTTP credentials configured: true` і `Course project structure: OK`.

### 4. Запуск

| Завдання | Команда |
|---|---|
| Запустити тест ДЗ | `npx playwright test tests/guest-add-car.spec.ts --project=chromium` |
| Побачити браузер | `npx playwright test tests/guest-add-car.spec.ts --project=chromium --headed` |
| Покроковий режим | `npx playwright test tests/guest-add-car.spec.ts --project=chromium --debug` |
| Інтерактивний режим UI | `npm run test:ui` |
| Усі тести | `npx playwright test --project=chromium` |
| Відкрити HTML-звіт | `npm run report` |

Очікуваний результат для тесту ДЗ: `1 passed`.

### 5. Запуск у VS Code

1. Відкрийте папку `playwright-starter` як корінь робочого простору.
2. Встановіть розширення **Playwright Test for VSCode**.
3. Відкрийте вкладку **Testing** і запустіть `Guest adds Audi TT to Garage`.

### 6. Якщо тест упав

1. Прочитайте помилку в терміналі.
2. Виконайте `npm run report` і відкрийте скриншот та trace цього тесту.
3. Якщо `npm run preflight` показує `HTTP credentials configured: false`, перевірте файл із кроку 2.
4. Встановіть причину за фактами і лише тоді вносьте правку. Не додавайте фіксованих пауз і не послаблюйте перевірки.

## Як повторити planner і generator

Файли агентів не зберігаються у Git, бо вони генеруються однією командою:

```bash
cd playwright-starter
npx playwright init-agents --loop=claude
```

Запуск planner:

```bash
claude -p "Create a test plan using tests/seed.spec.ts and specs/add-car.md" \
  --agent playwright-test-planner --mcp-config .mcp.json --strict-mcp-config \
  --allowedTools "mcp__playwright-test,Read,Glob,Grep"
```

Для generator замініть агента на `playwright-test-generator` і передайте сценарій із плану.

## Безпека

У Git не потрапляють `.env`, `.playwright/`, токени, `node_modules`, звіти та конфігурація агентів: див. [`.gitignore`](.gitignore).
Не вставляйте credentials у тести, документи чи evidence.
