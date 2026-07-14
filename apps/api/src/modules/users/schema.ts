import { t } from "elysia";

export const UpdateMeBody = t.Object({
    locale: t.Union([t.String({ minLength: 2, maxLength: 5 }), t.Null()]),
})