import { createFileRoute } from "@tanstack/react-router";
import { CommunitiesPage } from "@/features/communities/public/communities-page";

export const Route = createFileRoute("/")({
	component: CommunitiesPage,
});
