import { createFileRoute } from "@tanstack/react-router";
import { CommunityDetail } from "@/features/community-detail";

export const Route = createFileRoute("/community/$id/")({
	component: CommunityDetail,
});
