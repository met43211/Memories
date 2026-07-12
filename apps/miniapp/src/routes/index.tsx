import { Button } from "@memories/ui";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: Home,
});

function Home() {
	return (
		<div className="space-y-4 p-4">
			<h1 className="font-semibold text-2xl">Мои компании</h1>
			<Link to="/community/$id" params={{ id: "1" }}>
				<Button color="success">Weekend Crew</Button>
			</Link>
		</div>
	);
}
