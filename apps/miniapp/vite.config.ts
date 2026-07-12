import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	plugins: [react(), tailwindcss(), tsconfigPaths()],
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
	build: {
		target: "es2022",
		rolldownOptions: {
			output: {
				codeSplitting: {
					groups: [
						{
							name: "react",
							test: (id) => /node_modules[\\/](react-dom|react)/.test(id),
						},
					],
				},
			},
		},
	},
});
