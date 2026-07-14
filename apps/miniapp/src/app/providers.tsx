import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { queryClient } from "./query-client";

export function AppProviders({ children }: { children: ReactNode }) {
	return (
		<I18nProvider i18n={i18n}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</I18nProvider>
	);
}
