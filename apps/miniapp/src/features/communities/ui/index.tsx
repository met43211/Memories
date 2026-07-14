import { Trans } from "@lingui/react/macro";
import { Text } from "@memories/ui";

export function CommunitiesPage() {
	return (
		<div className="space-y-4 p-4">
			<Text tag="h1" weight={600} size={24}>
				<Trans>My communities</Trans>
			</Text>
		</div>
	);
}
