import { Elysia } from "elysia";
import { config } from "@/config";
import { validateInitData } from "@/plugins/auth/init-data";
import { AuthErrors } from "./errors";
import { authService } from "./service";

export const auth = new Elysia({ name: "auth" }).derive(
	{ as: "scoped" },
	async ({ headers }) => {
		const devUserId = headers["x-dev-user"];
		if (config.env !== "production" && devUserId) {
			const devUser = await authService.findByTgId(BigInt(devUserId));
			if (devUser) {
				return {
					user: devUser,
				};
			}
		}
		const header = headers["authorization"];
		if (!header?.startsWith("tma ")) {
			throw AuthErrors.missingCredentials();
		}

		const tgUser = validateInitData(header.slice(4), config.botToken);
		if (!tgUser) {
			throw AuthErrors.invalidInitData();
		}

		const user = await authService.findOrCreate(tgUser);

		return { user };
	},
);
