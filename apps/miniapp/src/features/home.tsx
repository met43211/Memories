import { Trans } from "@lingui/react/macro";
import { Button } from "@memories/ui";
import { Link } from "@tanstack/react-router";

export function Home() {
	return (
		<div className="space-y-4 p-4">
			<h1 className="font-semibold text-2xl">
				<Trans>My communities</Trans>
			</h1>
			<Link to="/community/$id" params={{ id: "1" }}>
				<Button>Weekend Crew</Button>
			</Link>
		</div>
	);
}
