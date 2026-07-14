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
			xs: "text-xs",
			sm: "text-sm",
			base: "text-base",
			lg: "text-lg",
			xl: "text-xl",
			"2xl": "text-2xl",
			"3xl": "text-3xl",
			"4xl": "text-4xl",
			"5xl": "text-5xl",
			"6xl": "text-6xl",
			"7xl": "text-7xl",
			"8xl": "text-8xl",
			"9xl": "text-9xl",
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
		size: "base",
		opacity: 100,
		isCopyable: false,
	},
});

export type FlexTvProps = VariantProps<typeof textTV>;
