# Memories

Telegram Mini App для хранения совместных воспоминаний (Community → Event → Photo).

## Стек

- Runtime + package manager: **Bun** (не npm/pnpm/yarn/node)
- Монорепа: Bun workspaces + Turborepo
- `apps/api` — Elysia, `apps/bot` — grammY, `apps/miniapp` — Vite + React 19
- Роутинг: TanStack Router (файловый), данные: TanStack Query
- Стили: Tailwind v4, headless: Base UI
- ORM: Drizzle + Postgres
- Линт/формат: Biome

## Команды

- `bun install` — установка (никогда не `npm install`)
- `bun dev` — все приложения через Turbo
- `bunx turbo run check-types` — проверка типов
- `bunx biome check --write .` — линт + формат

## Правила

- Валидация — **TypeBox**, не Zod. Elysia построен на нём, схемы переиспользуются во фронте.
- Tailwind v4: **нет** `tailwind.config.js` и `postcss.config.js`. Конфиг — в CSS через `@theme inline`.
- Цвета только через семантические токены (`bg-surface`, `text-fg`). Никаких `bg-slate-900 dark:...`.
- Тема приходит из Telegram `themeParams`, тёмная — по классу `.dark`, не по `prefers-color-scheme`.
- Импорт типов — только `import type` (включён `verbatimModuleSyntax`).
- Тип `App` из `@memories/api` импортировать **только как type** — иначе Elysia утечёт в браузерный бандл.
- tsconfig наследуется от `@memories/tsconfig/*`. Не создавать локальные `compilerOptions` без нужды.
- Не трогать `routeTree.gen.ts` — он генерируется.
- Не добавлять Next.js, SSR, TanStack Start.

## Чего не делать

- Не ставить пакеты глобально.
- Не предлагать `localStorage` для состояния — Mini App работает в WebView.
- Не писать barrel-файлы (`index.ts` с реэкспортом всего) — ломают tree-shaking.

## Проверка перед сдачей работы

Обязательно прогнать и добиться зелёного:
1. `bunx turbo run check-types`
2. `bunx biome check --write .`
3. `bun run dma` (miniapp — Derived Modular Architecture)

Не сообщать о готовности, пока все три команды не проходят.