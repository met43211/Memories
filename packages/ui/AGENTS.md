# UI (@memories/ui)

shadcn-компоненты в `src/ui/`. Импорт: `@memories/ui/button`.

- Ставить только через `bunx shadcn@latest add <name>` **из этой папки**, не из приложения.
- Токены — в `src/styles/globals.css`. Это единственное место, где живут цвета.
- Не добавлять `react` в `dependencies` — только `peerDependencies`.
- Не создавать barrel-файл `index.ts` — ломает tree-shaking, у Mini App критичен размер бандла.
- Цвета берутся из Telegram themeParams в рантайме, поэтому в hex, а не в oklch. Не менять формат.