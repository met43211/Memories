import { Trans } from "@lingui/react/macro";
import { Flex, Text } from "@memories/ui";
import type { PropsWithChildren } from "react";

export const CommunitiesLayout = ({ children }: PropsWithChildren) => {
	return (
		<Flex vertical>
			<Text tag="h1" weight={600} size="2xl">
				<Trans>My communities</Trans>
			</Text>
			{children}
		</Flex>
	);
};
