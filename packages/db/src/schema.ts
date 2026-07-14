import { relations } from "drizzle-orm";
import {
	bigint,
	boolean,
	index,
	integer,
	pgEnum,
	pgTable,
	primaryKey,
	text,
	timestamp,
	uniqueIndex,
	uuid,
} from "drizzle-orm/pg-core";

const timestamps = {
	createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp({ withTimezone: true })
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
};

export const users = pgTable(
	"users",
	{
		id: uuid().primaryKey().defaultRandom(),
		tgId: bigint({ mode: "bigint" }).notNull(),
		username: text(),
		firstName: text().notNull(),
		lastName: text(),
		avatarUrl: text(),
		locale: text(),
		...timestamps,
	},
	(t) => [uniqueIndex("users_tg_id_idx").on(t.tgId)],
);

export const communities = pgTable(
	"communities",
	{
		id: uuid().primaryKey().defaultRandom(),
		tgChatId: bigint({ mode: "bigint" }),
		name: text().notNull(),
		ownerId: uuid().references(() => users.id),
		avatarKey: text(),
		tgPhotoId: text(),
		...timestamps,
	},
	(t) => [uniqueIndex("communities_tg_chat_id_idx").on(t.tgChatId)],
);

export const memberRole = pgEnum("member_role", ["owner", "admin", "member"]);

export const communityMembers = pgTable(
	"community_members",
	{
		communityId: uuid()
			.notNull()
			.references(() => communities.id, { onDelete: "cascade" }),
		userId: uuid()
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		role: memberRole("role").notNull().default("member"),
		joinedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
	},
	(t) => [
		primaryKey({ columns: [t.communityId, t.userId] }),
		index("members_user_id_idx").on(t.userId),
	],
);

export const events = pgTable(
	"events",
	{
		id: uuid().primaryKey().defaultRandom(),
		communityId: uuid()
			.notNull()
			.references(() => communities.id, { onDelete: "cascade" }),
		title: text().notNull(),
		description: text(),
		place: text(),
		happenedAt: timestamp({ withTimezone: true }),
		createdBy: uuid()
			.notNull()
			.references(() => users.id),
		...timestamps,
	},
	(t) => [index("events_community_idx").on(t.communityId, t.happenedAt)],
);

export const memories = pgTable(
	"memories",
	{
		id: uuid().primaryKey().defaultRandom(),
		communityId: uuid()
			.notNull()
			.references(() => communities.id, { onDelete: "cascade" }),
		tags: text().array().default([]),

		eventId: uuid().references(() => events.id, { onDelete: "set null" }),

		uploadedBy: uuid()
			.notNull()
			.references(() => users.id),

		storageKey: text().notNull(),
		thumbnailKey: text(),
		telegramFileId: text(),

		mimeType: text().notNull(),
		sizeBytes: integer().notNull(),
		width: integer(),
		height: integer(),
		isVideo: boolean().notNull().default(false),

		contentHash: text().notNull(),
		takenAt: timestamp({ withTimezone: true }),

		...timestamps,
	},
	(t) => [
		index("memories_community_event_idx").on(
			t.communityId,
			t.eventId,
			t.createdAt,
		),
		uniqueIndex("memories_dedup_idx").on(t.communityId, t.contentHash),
	],
);

export const usersRelations = relations(users, ({ many }) => ({
	memberships: many(communityMembers),
}));

export const communitiesRelations = relations(communities, ({ one, many }) => ({
	owner: one(users, { fields: [communities.ownerId], references: [users.id] }),
	members: many(communityMembers),
	events: many(events),
	memories: many(memories),
}));

export const communityMembersRelations = relations(
	communityMembers,
	({ one }) => ({
		community: one(communities, {
			fields: [communityMembers.communityId],
			references: [communities.id],
		}),
		user: one(users, {
			fields: [communityMembers.userId],
			references: [users.id],
		}),
	}),
);

export const eventsRelations = relations(events, ({ one, many }) => ({
	community: one(communities, {
		fields: [events.communityId],
		references: [communities.id],
	}),
	memories: many(memories),
}));

export const memoriesRelations = relations(memories, ({ one }) => ({
	community: one(communities, {
		fields: [memories.communityId],
		references: [communities.id],
	}),
	event: one(events, { fields: [memories.eventId], references: [events.id] }),
	uploader: one(users, {
		fields: [memories.uploadedBy],
		references: [users.id],
	}),
}));
