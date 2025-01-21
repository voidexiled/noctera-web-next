import { AdminBattlepassProvider } from "@/app/account-manager/admin/battlepass/components/context/AdminBattlepassProvider";
import { SeasonsContent } from "@/app/account-manager/admin/battlepass/components/seasons/SeasonsContent";
import { prisma } from "@/lib/prisma";

async function getSeasons() {
	const seasons = await prisma.battlepass_seasons.findMany();
	return seasons;
}

async function getTasks() {
	const tasks = await prisma.battlepass_seasons_tasks.findMany();
	return tasks;
}

async function getRewards() {
	const rewards = await prisma.battlepass_seasons_rewards.findMany();
	return rewards;
}

export default async function AdminBattlepassSeasons() {
	const seasons = await getSeasons();
	const tasks = await getTasks();
	const rewards = await getRewards();

	return (
		<AdminBattlepassProvider
			battlepassSeasons={seasons}
			battlepassRewards={rewards}
			battlepassTasks={tasks}
		>
			<SeasonsContent />
		</AdminBattlepassProvider>
	);
}
