import { describe, expect, it } from "bun:test";
import { createHmac } from "node:crypto";
import { validateInitData } from "./init-data";

const BOT_TOKEN = "123456:TEST_TOKEN";

const VALID_USER = {
	id: 111111111,
	first_name: "Ruslan",
	username: "ruslan",
	language_code: "ru",
};

/** Builds a valid initData string — mimics what Telegram does */
function makeInitData(overrides: Record<string, string> = {}) {
	const params = new URLSearchParams({
		auth_date: String(Math.floor(Date.now() / 1000)),
		query_id: "AAHdqTcvAAAAAN2pNy",
		user: JSON.stringify(VALID_USER),
		...overrides,
	});

	const dataCheckString = [...params.entries()]
		.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
		.map(([k, v]) => `${k}=${v}`)
		.join("\n");

	const secretKey = createHmac("sha256", "WebAppData")
		.update(BOT_TOKEN)
		.digest();
	const hash = createHmac("sha256", secretKey)
		.update(dataCheckString)
		.digest("hex");

	params.set("hash", hash);
	return params.toString();
}

describe("validateInitData", () => {
	it("accepts valid init data", () => {
		const user = validateInitData(makeInitData(), BOT_TOKEN);

		expect(user).not.toBeNull();
		expect(user?.id).toBe(111111111);
		expect(user?.first_name).toBe("Ruslan");
		expect(user?.language_code).toBe("ru");
	});

	it("rejects a tampered hash", () => {
		const tampered = makeInitData().replace(/hash=[a-f0-9]+/, "hash=deadbeef");
		expect(validateInitData(tampered, BOT_TOKEN)).toBeNull();
	});

	it("rejects a forged user payload", () => {
		const initData = makeInitData();
		const forged = initData.replace(
			encodeURIComponent(JSON.stringify(VALID_USER)),
			encodeURIComponent(JSON.stringify({ id: 999, first_name: "Attacker" })),
		);
		expect(validateInitData(forged, BOT_TOKEN)).toBeNull();
	});

	it("rejects data signed with a different bot token", () => {
		expect(validateInitData(makeInitData(), "999:OTHER_TOKEN")).toBeNull();
	});

	it("rejects expired auth_date", () => {
		const yesterday = String(Math.floor(Date.now() / 1000) - 25 * 3600);
		expect(
			validateInitData(makeInitData({ auth_date: yesterday }), BOT_TOKEN),
		).toBeNull();
	});

	it("rejects data without a hash", () => {
		expect(validateInitData("user=%7B%7D&auth_date=123", BOT_TOKEN)).toBeNull();
	});
});
