import type { VariantProps } from "tailwind-variants";

import { tv } from "#lib/utils/styling";

export const flexTV = tv({
	base: "flex",
	variants: {
		vertical: {
			true: "flex-col",
		},
		justify: {
			center: "justify-center",
			start: "justify-start",
			end: "justify-end",
			between: "justify-between",
			around: "justify-around",
			evenly: "justify-evenly",
		},
		align: {
			center: "items-center",
			start: "items-start",
			end: "items-end",
			stretch: "items-stretch",
			baseline: "items-baseline",
		},
		width: {
			full: "w-full",
			fit: "w-fit",
		},
		gap: {
			0: "gap-0",
			1: "gap-1",
			2: "gap-2",
			3: "gap-3",
			4: "gap-4",
			6: "gap-6",
			8: "gap-8",
			10: "gap-10",
			12: "gap-12",
			16: "gap-16",
			20: "gap-20",
			32: "gap-32",
		},
	},
	defaultVariants: {
		width: "full",
		gap: 4,
	},
});

export type FlexTvProps = VariantProps<typeof flexTV>;
