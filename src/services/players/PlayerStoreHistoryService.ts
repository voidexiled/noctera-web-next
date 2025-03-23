import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

type GetPlayerStoreHistorysProps = {
	select?: Prisma.store_historySelect;
	where?: Prisma.store_historyWhereInput;
	take?: number;
	skip?: number;
};

export async function getPlayerStoreHistorys({
	select,
	where,
	take,
	skip,
}: GetPlayerStoreHistorysProps) {
	const playerStoreHistory = await prisma.store_history.findMany({
		select,
		where,
		take,
		skip,
	});

	return playerStoreHistory;
}

type GetPlayerStoreHistoryProps = {
	select?: Prisma.store_historySelect;
	where?: Prisma.store_historyWhereUniqueInput;
};

export async function getPlayerStoreHistory({ select, where }: GetPlayerStoreHistoryProps) {
	if (!where) return null;
	const playerStoreHistory = await prisma.store_history.findUnique({
		where,
		select,
	});

	return playerStoreHistory;
}

type UpdatePlayerStoreHistoryProps = {
	where: Prisma.store_historyWhereUniqueInput;
	data: Prisma.store_historyUpdateInput;
};

export async function updatePlayerStoreHistory({ where, data }: UpdatePlayerStoreHistoryProps) {
	return await prisma.store_history.update({
		where,
		data,
	});
}

type CreatePlayerStoreHistoryProps = {
	data: Prisma.store_historyCreateManyInput;
};

export async function createPlayerStoreHistory({ data }: CreatePlayerStoreHistoryProps) {
	return await prisma.store_history.create({
		data,
	});
}
