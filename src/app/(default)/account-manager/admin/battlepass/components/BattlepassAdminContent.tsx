import { RewardsContent } from "@/app/(default)/account-manager/admin/battlepass/components/rewards/RewardsContent";
import { SeasonsContent } from "@/app/(default)/account-manager/admin/battlepass/components/seasons/SeasonsContent";
import { TasksContent } from "@/app/(default)/account-manager/admin/battlepass/components/tasks/TasksContent";
import { usePathname } from "next/navigation";

export const BattlepassAdminContent = () => {
	const pathname = usePathname();

	const partes = pathname.split("/");
	const ultimoPath = partes[partes.length - 1];

	return (
		<div className="p-2">
			{ultimoPath === "rewards" ? (
				<RewardsContent />
			) : ultimoPath === "tasks" ? (
				<TasksContent />
			) : (
				<SeasonsContent />
			)}
		</div>
	);
};
