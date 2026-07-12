# API (Elysia + Bun)

## Валидация

Только **TypeBox** (`t` из `elysia`). Не Zod.
Схема пишется в самом роуте — из неё автоматически берутся типы и OpenAPI.

```ts
.post("/events", ({ body }) => createEvent(body), {
  body: t.Object({
    title: t.String({ minLength: 1 }),
    date: t.Optional(t.String({ format: "date" })),
  }),
})
```

## Структура

- Роуты группируются в плагины: `new Elysia({ prefix: "/events" })`, один плагин — один файл в `src/routes/`.