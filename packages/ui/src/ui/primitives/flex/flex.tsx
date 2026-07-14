import type { ElementType, RefObject } from "react";
import { type FlexTvProps, flexTV } from "./classnames";

export type FlexProps<T extends React.ElementType> = FlexTvProps &
	React.HTMLAttributes<T> & {
		as?: ElementType;
		ref?: RefObject<T>;
	};

export const Flex = <T extends ElementType = "div">(props: FlexProps<T>) => {
	const {
		className,
		children,
		justify,
		align,
		width,
		gap,
		col,
		ref,
		as,
		...rest
	} = props;

	const Component = as || "div";

	const classNames = flexTV({ justify, align, col, className, width, gap });

	return (
		<Component ref={ref} className={classNames} {...rest}>
			{children}
		</Component>
	);
};

Flex.displayName = "Flex";
