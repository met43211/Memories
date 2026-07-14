# API (Elysia + Bun)

Бэкенд Memories. Обслуживает Mini App и бота.

## Архитектура: vertical slice

Группировка по фиче, не по слою. Один модуль = один Elysia-плагин.

```
src/
├── index.ts              # композиция плагинов
├── lib/
│   ├── errors.ts         # AppError + коды
│   └── storage.ts        # R2 presigned URLs
├── plugins/
│   ├── auth.ts           # derive: user из initData
│   └── error.ts          # onError → HTTP-коды
└── modules/
    └── <feature>/
        ├── index.ts      # роуты
        ├── schema.ts     # TypeBox
        ├── service.ts    # логика + db
        └── service.test.ts
```

**Три правила:**

1. **Роут не знает про БД.** Парсит вход, зовёт сервис, отдаёт результат. Появился `db.` в `index.ts` — логика утекла не туда.
2. **Сервис не знает про HTTP.** Не возвращает статусы и не трогает `set.status`. Бросает `AppError`. Маппинг в HTTP — только в `plugins/error.ts`.
3. **Модули не импортируют друг друга.** Общий код — в `lib/`. Если очень надо — импортировать чужой `service`, никогда не `index.ts`.

Слоя `repositories/` **нет и не будет**. Drizzle уже является абстракцией над SQL — оборачивать его в свой репозиторий значит писать `findById`, который вызывает `db.query.findFirst`. Это лишний слой, который к тому же рвёт вывод типов.

---

## Два инварианта. Нарушение = уязвимость

### 1. Изоляция Community

**В КАЖДОМ запросе к `memories` и `events` обязано быть условие `communityId = ?`.**

```ts
// ❌ ДЫРА: любой пользователь дотянется до чужого события, зная UUID
where(eq(events.id, eventId))

// ✅
where(and(eq(events.id, eventId), eq(events.communityId, communityId)))
```

Плюс перед любой операцией — проверка членства (`assertMember`). Не полагаться на то, что «UUID никто не угадает».

Это не всплывёт в тестах. Только в проде.

### 2. Атомарность разбора Inbox

Перемещение фото в Event — всегда `UPDATE` с условием `event_id IS NULL`:

```ts
await tx.update(memories)
  .set({ eventId })
  .where(and(
    inArray(memories.id, ids),
    eq(memories.communityId, communityId),
    isNull(memories.eventId),        // ← защита от гонки
  ))
  .returning({ id: memories.id });
```

Вернулось меньше строк, чем просили → кто-то уже забрал эти фото → `AppError("MEMORIES_ALREADY_ASSIGNED")`. Без `isNull` двое, разбирающие Inbox одновременно, молча перезапишут работу друг друга.

Всё, что затрагивает больше одной таблицы (создать Event + перенести фото; создать Community + добавить владельца), — в `db.transaction`.

---

## Валидация

**Только TypeBox** (`t` из `elysia`). Не Zod. Elysia построен на нём: из одной схемы получаем рантайм-валидацию, типы и OpenAPI.

```ts
.post("/events", ({ body }) => eventsService.create(body), {
  body: t.Object({
    title: t.String({ minLength: 1, maxLength: 200 }),
    memoryIds: t.Array(t.String({ format: "uuid" }), { minItems: 1, maxItems: 500 }),
  }),
})
```

⚠️ У массивов **всегда** ставить `maxItems`. Без верхней границы кто-нибудь пришлёт 100 000 UUID, и `inArray` положит Postgres.

---

## Ошибки

API отдаёт **коды**, не тексты:

```ts
// ❌ { error: "Событие не найдено" }
// ✅ { error: "EVENT_NOT_FOUND" }
```

Бэкенд не знает язык пользователя. Текст рисует Lingui на фронте.

Сервис бросает `new AppError("EVENT_NOT_FOUND")`. `plugins/error.ts` превращает в HTTP-статус.

---

## Авторизация

Только Telegram `initData` (HMAC-SHA256). Ни сессий, ни JWT-логина, ни паролей, ни OAuth.

- Заголовок: `Authorization: tma <initData>`
- Секрет: `HMAC(botToken, key="WebAppData")` — именно в этом порядке, перепутать легко
- **Обязательно проверять `auth_date`** — initData старше 24 часов отклонять, иначе перехваченный работает вечно
- Пользователь создаётся при первом заходе через `onConflictDoUpdate` по `tgId` (upsert, не select-then-insert)

⚠️ **Dev-обход (`x-dev-user`) не должен работать при `NODE_ENV=production`.** Это дыра, через которую можно представиться кем угодно. Условие на окружение — обязательно.

---

## БД

`@memories/db`. Импорт только оттуда, не из `drizzle-orm` напрямую.

- **`memories.eventId` nullable — это и есть Inbox.** Фото без события принадлежит только Community. Не делать `NOT NULL`, не заводить таблицу `inbox`.
- **`bigint` не сериализуется в JSON.** `tgId` и `tgChatId` — только `.toString()` на границе API. `JSON.stringify(BigInt)` бросает `TypeError`.
- Миграции: `bunx drizzle-kit generate`, применяет их **человек**, не агент.
- **Никогда не запускать `drizzle-kit push`** — он меняет схему без миграции.
- Возвращать сырые ошибки Postgres наружу нельзя.

---

## Плагины Elysia

- Каждый модуль — `new Elysia({ name: "...", prefix: "/..." })`.
- **`name` обязателен.** Elysia кэширует плагины по имени; без него при повторном `.use()` логика выполнится дважды.
- Плагины с `derive` — `{ as: "scoped" }`, чтобы контекст не утекал глобально.

---

## Экспорт для фронта

`src/index.ts` содержит `export type App = typeof app` — контракт для Eden Treaty. Форму экспорта не менять: сломает типы в miniapp.

Секреты — только `Bun.env`, никогда в коде.

---

## Тесты

`bun test` (встроен, jest-совместим). На **реальной БД** в Docker, не на моках.

Мокать Drizzle бессмысленно: вы будете тестировать мок, а не SQL. А ломается всегда SQL — забытое условие `communityId`, неверный join, гонка на `UPDATE`.

Тестировать сервисы, не роуты.