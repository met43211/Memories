import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [react()],
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
