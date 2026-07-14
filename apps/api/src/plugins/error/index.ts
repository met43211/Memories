import { Elysia } from "elysia";
import { config } from "@/config";
import { AppError } from "@/lib/errors";

export const errorHandler = new Elysia({ name: "error" })
	.error({ APP: AppError })
	.onError({ as: "global" }, ({ code, error, set }) => {
		if (error instanceof AppError) {
			set.status = error.status;
			return { error: error.code, ...error.meta };
		}

		if (code === "VALIDATION") {
			set.status = 400;
			return { error: "VALIDATION_FAILED" };
		}

		if (code === "NOT_FOUND") {
			set.status = 404;
			return { error: "ROUTE_NOT_FOUND" };
		}

		console.error("[UNHANDLED]", error);
		set.status = 500;
		return {
			error: "INTERNAL",
			...(config.env !== "production" && {
				detail: error instanceof Error ? error.message : String(error),
			}),
		};
	});
