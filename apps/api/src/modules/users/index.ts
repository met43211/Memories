import Elysia from "elysia";
import { auth } from "@/plugins/auth";
import { UpdateMeBody } from "./schema";
import { usersService } from "./service";

export const usersModule = new Elysia({ name: "users", prefix: "/me" })
	.use(auth)
	.get("/", ({ user }) => usersService.toPublic(user))
	.patch(
		"/",
		async ({ user, body }) => {
			const updated = await usersService.updateLocale(user.id, body.locale);
			return usersService.toPublic(updated);
		},
		{ body: UpdateMeBody },
	);
