import { communities, communityMembers, db, eq } from "@memories/db";

export const communitiesService = {
	async listForUser(userId: string) {
		return db
			.select({
				id: communities.id,
				name: communities.name,
				avatarKey: communities.avatarKey,
				role: communityMembers.role,
				joinedAt: communityMembers.joinedAt,
			})
			.from(communityMembers)
			.innerJoin(communities, eq(communityMembers.communityId, communities.id))
			.where(eq(communityMembers.userId, userId))
			.orderBy(communities.name);
	},
};
