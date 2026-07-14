export const ErrorCode = {
	UNAUTHORIZED: "UNAUTHORIZED",
	INVALID_INIT_DATA: "INVALID_INIT_DATA",
	VALIDATION_FAILED: "VALIDATION_FAILED",
	INTERNAL: "INTERNAL",
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

export class AppError extends Error {
	readonly code: string;
	readonly status: number;
	readonly meta?: Record<string, unknown>;

	constructor(code: string, status: number, meta?: Record<string, unknown>) {
		super(code);
		this.name = "AppError";
		this.code = code;
		this.status = status;
		this.meta = meta;
	}
}
