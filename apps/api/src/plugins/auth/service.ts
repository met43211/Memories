import type { User } from "@memories/db";
import { db, eq, users } from "@memories/db";
import type { TgUser } from "./types";

export const authService = {
	async findOrCreate(tgUser: TgUser): Promise<User> {
		const [user] = await db
			.insert(users)
			.values({
				tgId: BigInt(tgUser.id),
				username: tgUser.username,
				firstName: tgUser.first_name,
				lastName: tgUser.last_name,
				locale: tgUser.language_code,
			})
			.onConflictDoUpdate({
				target: users.tgId,
				set: {
					username: tgUser.username,
					firstName: tgUser.first_name,
					lastName: tgUser.last_name,
				},
			})
			.returning();

		return user as User;
	},

	async findByTgId(tgId: bigint): Promise<User | undefined> {
		const [user] = await db
			.select()
			.from(users)
			.where(eq(users.tgId, tgId))
			.limit(1);

		return user;
	},
};
