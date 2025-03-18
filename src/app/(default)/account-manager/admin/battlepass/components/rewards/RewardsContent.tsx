"use client";

import { NewRewardForm } from "@/app/(default)/account-manager/admin/battlepass/components/rewards/NewRewardForm";
import { RewardsGrid } from "@/app/(default)/account-manager/admin/battlepass/components/rewards/RewardsGrid";

export const RewardsContent = () => {
	return (
		<div className="grid grid-rows-[1fr_auto] overflow-hidden">
			<RewardsGrid />
			<NewRewardForm />
		</div>
	);
};
