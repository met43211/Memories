import { createHmac } from "node:crypto";
import type { TgUser } from "./types";

const MAX_AGE_SEC = 24 * 60 * 60;

export function validateInitData(
	initData: string,
	botToken: string,
): TgUser | null {
	const params = new URLSearchParams(initData);

	const hash = params.get("hash");
	if (!hash) return null;
	params.delete("hash");

	const dataCheckString = [...params.entries()]
		.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
		.map(([key, value]) => `${key}=${value}`)
		.join("\n");

	const secretKey = createHmac("sha256", "WebAppData")
		.update(botToken)
		.digest();

	const computed = createHmac("sha256", secretKey)
		.update(dataCheckString)
		.digest("hex");
	if (computed !== hash) return null;

	const authDate = Number(params.get("auth_date"));
	if (!Number.isFinite(authDate)) return null;
	if (Date.now() / 1000 - authDate > MAX_AGE_SEC) return null;

	const rawUser = params.get("user");
	if (!rawUser) return null;

	try {
		return JSON.parse(rawUser) as TgUser;
	} catch {
		return null;
	}
}
