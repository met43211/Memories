import cors from "@elysiajs/cors";
import { Elysia } from "elysia";
import { config } from "./config";
import { communitiesModule } from "./modules/communities";
import { usersModule } from "./modules/users";
import { errorHandler } from "./plugins/error";

export const app = new Elysia()
	.use(cors({ origin: config.corsOrigins }))
	.use(errorHandler)
	.get("/health", () => ({ ok: true }))
	.use(usersModule)
	.use(communitiesModule)
	.listen(config.port);

export type App = typeof app;

console.log(`API on http://localhost:${config.port}`);
