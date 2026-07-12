# DB (Drizzle + Postgres)

## Миграции

- Схема — `src/schema.ts`. SQL в `drizzle/` **генерируется**, руками не править.
- Генерация: `bunx drizzle-kit generate`.
- **Никогда не запускать `drizzle-kit push`** — он меняет боевую схему без миграции.
- Применение миграций делает человек, не агент.

## Конвенции

- Таблицы — snake_case, множественное число: `community_members`.
- Поля в TS — camelCase, маппинг через второй аргумент: `telegramId: bigint("telegram_id")`.
- Telegram ID — `bigint`, не `integer` (не влезает).
- Первичные ключи — `uuid` с `defaultRandom()`.
- Каждая таблица: `createdAt`, `updatedAt` (`timestamp with time zone`).

## Ключевое правило домена

`photos.event_id` — **nullable**. Это и есть Inbox: фото без события принадлежит только Community.
Не делать его `NOT NULL` и не заводить отдельную таблицу `inbox`.

## Экспорт

Пакет отдаёт `.ts` напрямую (JIT), билд-шага нет. Не добавлять tsup/tsc-сборку.