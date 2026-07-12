# Mini App (Vite + React 19 + TanStack Router)

Работает **внутри Telegram WebView**. Не обычный веб-сайт.

## Роутинг

- Файловый, папка `src/routes/`. Новый экран = новый файл.
- `routeTree.gen.ts` генерируется автоматически — **не редактировать, не коммитить**.
- Search-параметры — через `validateSearch` с TypeBox-схемой, не через `useSearchParams`.
- Данные грузятся в `loader` через `context.queryClient.ensureQueryData`.

## Стили

- Tailwind **v4**. Файлов `tailwind.config.js` и `postcss.config.js` не существует — не создавать.
- Токены объявлены в `src/styles/theme.css`, регистрируются через `@theme inline`.
- Использовать **только семантические классы**: `bg-bg`, `bg-surface`, `text-fg`, `text-muted`, `bg-accent`, `rounded-app`.
- **Никогда** не писать `bg-white dark:bg-slate-900` и любые сырые цвета из палитры Tailwind.
- Тёмная тема — по классу `.dark` на `<html>`. Не использовать `prefers-color-scheme`.

## Telegram

- SDK: `@telegram-apps/sdk-react`. Инициализация — в `main.tsx`, повторно не вызывать.
- Высота экрана — `var(--tg-viewport-stable-height)`, **не `100vh`** (сломается на iOS).
- Нет `localStorage`/`sessionStorage` — состояние в React Query / Zustand.
- Приложение должно открываться и вне Telegram (фолбэк-тема), не падать на отсутствии SDK.

## API

```ts
import type { App } from "@memories/api"; // ТОЛЬКО import type
import { treaty } from "@elysiajs/eden";
```
Рантайм-импорт из `@memories/api` затащит весь бэкенд в бандл. Это ошибка.

## Производительность

Бандл критичен — WebView стартует на мобильном интернете.
Не добавлять тяжёлые зависимости (moment, lodash целиком, иконочные паки).
Не создавать barrel-файлы.