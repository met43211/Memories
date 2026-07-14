import Elysia from "elysia";
import { auth } from "@/plugins/auth";
import { communitiesService } from "./service";

export const communitiesModule = new Elysia({
	name: "communities",
	prefix: "/communities",
})
	.use(auth)
	.get("/", ({ user }) => communitiesService.listForUser(user.id));
