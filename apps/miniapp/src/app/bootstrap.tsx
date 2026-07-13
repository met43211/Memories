import { RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { loadCatalog } from "./i18n/load-catalog";
import { AppProviders } from "./providers";
import { router } from "./router";

export async function bootstrap() {
	await loadCatalog("ru");

	const rootEl = document.getElementById("root");
	if (!rootEl) throw new Error("#root not found");

	createRoot(rootEl).render(
		<StrictMode>
			<AppProviders>
				<RouterProvider router={router} />
			</AppProviders>
		</StrictMode>,
	);
}
