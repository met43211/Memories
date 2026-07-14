import { Type } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

const EnvSchema = Type.Object({
	NODE_ENV: Type.Union(
		[
			Type.Literal("development"),
			Type.Literal("test"),
			Type.Literal("production"),
		],
		{ default: "development" },
	),
	PORT: Type.Integer({ minimum: 1, maximum: 65535, default: 3000 }),
	DATABASE_URL: Type.String({ minLength: 1 }),
	BOT_TOKEN: Type.String({ pattern: "^\\d+:.+$" }),
	CORS_ORIGINS: Type.String({ default: "*" }),
});

function loadConfig() {
	const parsed = Value.Convert(EnvSchema, {
		NODE_ENV: Bun.env.NODE_ENV,
		PORT: Bun.env.PORT,
		DATABASE_URL: Bun.env.DATABASE_URL,
		BOT_TOKEN: Bun.env.BOT_TOKEN,
		CORS_ORIGINS: Bun.env.CORS_ORIGINS,
	});

	const withDefaults = Value.Default(EnvSchema, parsed);

	if (!Value.Check(EnvSchema, withDefaults)) {
		const errors = [...Value.Errors(EnvSchema, withDefaults)]
			.map((e) => `  ${e.path || "/"}: ${e.message}`)
			.join("\n");
		throw new Error(`Invalid environment:\n${errors}`);
	}

	const env = withDefaults;

	return {
		env: env.NODE_ENV,
		isProd: env.NODE_ENV === "production",
		isDev: env.NODE_ENV === "development",
		port: env.PORT,
		databaseUrl: env.DATABASE_URL,
		botToken: env.BOT_TOKEN,
		corsOrigins: env.CORS_ORIGINS === "*" ? true : env.CORS_ORIGINS.split(","),
	} as const;
}

export const config = loadConfig();
export type Config = typeof config;
