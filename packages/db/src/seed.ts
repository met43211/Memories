import { db } from "./index";
import {
	communities,
	communityMembers,
	events,
	memories,
	users,
} from "./schema";

async function seed() {
	console.log("🌱 Seeding...");

	// порядок обратный зависимостям
	await db.delete(memories);
	await db.delete(events);
	await db.delete(communityMembers);
	await db.delete(communities);
	await db.delete(users);

	const [ruslan, dima] = await db
		.insert(users)
		.values([
			{
				tgId: 111111111n,
				username: "ruslan",
				firstName: "Руслан",
				locale: "ru",
			},
			{
				tgId: 222222222n,
				username: "dima",
				firstName: "Дима",
				lastName: "К.",
				locale: "ru",
			},
		])
		.returning();

	if (!ruslan || !dima) throw new Error("Failed to create users");

	const [crew] = await db
		.insert(communities)
		.values({
			tgChatId: -1001234567890n,
			name: "Weekend Crew",
			ownerId: ruslan.id,
		})
		.returning();

	if (!crew) throw new Error("Failed to create community");

	await db.insert(communityMembers).values([
		{ communityId: crew.id, userId: ruslan.id, role: "owner" },
		{ communityId: crew.id, userId: dima.id, role: "member" },
	]);

	const [birthday] = await db
		.insert(events)
		.values({
			communityId: crew.id,
			title: "День рождения Руслана",
			happenedAt: new Date("2026-05-15"),
			createdBy: ruslan.id,
		})
		.returning();

	if (!birthday) throw new Error("Failed to create event");

	// 3 фото в Event
	await db.insert(memories).values(
		Array.from({ length: 3 }, (_, i) => ({
			communityId: crew.id,
			eventId: birthday.id,
			uploadedBy: ruslan.id,
			storageKey: `seed/event-${i}.jpg`,
			mimeType: "image/jpeg",
			sizeBytes: 1_200_000,
			width: 1920,
			height: 1080,
			contentHash: `seed-event-${i}`,
		})),
	);

	if (!memories) throw new Error("Failed to create memories");

	// 5 фото в Inbox — eventId = null
	await db.insert(memories).values(
		Array.from({ length: 5 }, (_, i) => ({
			communityId: crew.id,
			eventId: null,
			uploadedBy: dima.id,
			storageKey: `seed/inbox-${i}.jpg`,
			mimeType: "image/jpeg",
			sizeBytes: 900_000,
			width: 1600,
			height: 1200,
			contentHash: `seed-inbox-${i}`,
		})),
	);

	console.log("✅ Done: 2 users, 1 community, 1 event, 3 + 5 memories");
}

await seed();
process.exit(0);
