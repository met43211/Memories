import { Trans } from "@lingui/react/macro";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { meQuery } from "@/shared/lib/api/me-query";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
	{
		loader: ({ context }) => context.queryClient.ensureQueryData(meQuery()),
		component: RootLayout,
		errorComponent: AuthError,
	},
);

function RootLayout() {
	return (
		<div className="min-h-full bg-background text-foreground">
			<Outlet />
		</div>
	);
}

function AuthError() {
	return (
		<div className="flex min-h-dvh flex-col items-center justify-center gap-2 p-8 text-center">
			<p className="font-medium">
				<Trans>Could not sign in</Trans>
			</p>
			<p className="text-muted-foreground text-sm">
				<Trans>Open the app in Telegram</Trans>
			</p>
		</div>
	);
}
