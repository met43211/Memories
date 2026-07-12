import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/community/$id/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello</div>;
}
