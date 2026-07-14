import { AppError } from "@/lib/errors";

export const UserErrors = {
	notFound: () => new AppError("USER_NOT_FOUND", 404),
} as const;
