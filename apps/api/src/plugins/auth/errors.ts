import { AppError } from "../../lib/errors";

export const AuthErrors = {
	missingCredentials: () => new AppError("MISSING_CREDENTIALS", 401),
	invalidInitData: () => new AppError("INVALID_INIT_DATA", 401),
} as const;
