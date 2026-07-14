import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type {
	communities,
	communityMembers,
	events,
	memories,
	users,
} from "./schema";

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export type Community = InferSelectModel<typeof communities>;
export type NewCommunity = InferInsertModel<typeof communities>;

export type CommunityMember = InferSelectModel<typeof communityMembers>;
export type NewCommunityMember = InferInsertModel<typeof communityMembers>;

export type Event = InferSelectModel<typeof events>;
export type NewEvent = InferInsertModel<typeof events>;

export type Memory = InferSelectModel<typeof memories>;
export type NewMemory = InferInsertModel<typeof memories>;
