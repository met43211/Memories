import { treaty } from "@elysiajs/eden";
import type { App } from "@memories/api/types";

const DEV_USER = import.meta.env.VITE_DEV_USER;

function headers(): Record<string, string> {
	if (import.meta.env.DEV && DEV_USER) {
		return { "x-dev-user": DEV_USER };
	}

	return {};
}

const apiUrl = import.meta.env.VITE_API_URL;

if (!apiUrl) {
	throw new Error("VITE_API_URL is not defined");
}

export const api = treaty<App>(apiUrl, { headers });
