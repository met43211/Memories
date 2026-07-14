import type { VariantProps } from "tailwind-variants";

import { tv } from "#lib/utils/styling";

export const textTV = tv({
	variants: {
		opacity: {
			0: "opacity-0",
			10: "opacity-10",
			20: "opacity-20",
			30: "opacity-30",
			40: "opacity-40",
			50: "opacity-50",
			60: "opacity-60",
			70: "opacity-70",
			80: "opacity-80",
			90: "opacity-90",
			100: "opacity-100",
		},
		size: {
			8: "text-8",
			10: "text-10",
			12: "text-12",
			14: "text-14",
			16: "text-16",
			18: "text-18",
			20: "text-20",
			24: "text-24",
			28: "text-28",
			32: "text-32",
			36: "text-36",
			40: "text-40",
			48: "text-48",
			56: "text-56",
			64: "text-64",
			72: "text-72",
			80: "text-80",
			96: "text-96",
		},
		weight: {
			100: "font-thin",
			200: "font-extralight",
			300: "font-light",
			400: "font-normal",
			500: "font-medium",
			600: "font-semibold",
			700: "font-bold",
			800: "font-extrabold",
			900: "font-black",
		},
		isCopyable: {
			true: "select-text",
			false: "select-none",
		},
	},
	defaultVariants: {
		weight: 500,
		size: 16,
		opacity: 100,
		isCopyable: false,
	},
});

export type FlexTvProps = VariantProps<typeof textTV>;
