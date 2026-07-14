import type { ReactNode } from "react";
import { textTV } from "./classnames";

type Props = {
	children: ReactNode;
	tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
	className?: string;
	opacity?: 0 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100;
	size?:
		| 8
		| 10
		| 12
		| 14
		| 16
		| 18
		| 20
		| 24
		| 28
		| 32
		| 36
		| 40
		| 48
		| 56
		| 64
		| 72
		| 80
		| 96;
	weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
	isCopyable?: boolean;
};

export const Text = ({
	children,
	tag = "p",
	opacity,
	size,
	weight,
	isCopyable,
}: Props) => {
	const Tag = tag;

	const classNames = textTV({ opacity, size, weight, isCopyable });

	return <Tag className={classNames}>{children}</Tag>;
};
