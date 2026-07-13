import { defineConfig } from "@lingui/cli";

export default defineConfig({
	sourceLocale: "ru",
	locales: ["ru", "en"],
	catalogs: [
		{
			path: "<rootDir>/src/locales/{locale}",
			include: ["src"],
		},
	],
});
