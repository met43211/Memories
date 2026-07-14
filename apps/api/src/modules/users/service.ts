import type { User } from "@memories/db";
import { db, eq, users } from "@memories/db";
import { UserErrors } from "./errors";

export const usersService = {
	toPublic(user: User) {
		return {
			id: user.id,
			tgId: user.tgId.toString(),
			username: user.username,
			firstName: user.firstName,
			lastName: user.lastName,
			locale: user.locale,
			createdAt: user.createdAt.toISOString(),
		};
	},

	async updateLocale(userId: string, locale: string | null): Promise<User> {
		const [updated] = await db
			.update(users)
			.set({ locale })
			.where(eq(users.id, userId))
			.returning();

		if (!updated) throw UserErrors.notFound();

		return updated;
	},
};
