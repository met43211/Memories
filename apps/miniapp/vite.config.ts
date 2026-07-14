import path from "node:path";
import { fileURLToPath } from "node:url";
import { lingui } from "@lingui/vite-plugin";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const repoRoot = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	"../..",
);

export default defineConfig({
	envDir: repoRoot,
	plugins: [
		tanstackRouter({
			target: "react",
			autoCodeSplitting: true,
			generatedRouteTree: "./src/routeTree.gen.ts",
		}),
		babel({
			include: ["src/**/*.ts", "src/**/*.tsx"],
			presets: [reactCompilerPreset()],
			plugins: ["@lingui/babel-plugin-lingui-macro"],
		}),
		react(),
		lingui(),
		tailwindcss(),
	],
	resolve: {
		tsconfigPaths: true,
	},
	server: { port: 3001, allowedHosts: true },
	build: {
		target: "es2022",
	},
});
