"use server";

import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export async function GetManyGuildRanks<T extends Prisma.guild_ranksFindManyArgs>(args: T): Promise<Prisma.guild_ranksGetPayload<T>[]> {
	try {
		const guildRanks = await prisma.guild_ranks.findMany(args);
		return guildRanks as Prisma.guild_ranksGetPayload<T>[];
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export async function GetFirstGuildRanks<T extends Prisma.guild_ranksFindFirstArgs>(args: T): Promise<Prisma.guild_ranksGetPayload<T>> {
	try {
		const guildRanks = await prisma.guild_ranks.findFirst(args);
		return guildRanks as Prisma.guild_ranksGetPayload<T>;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export async function GetUniqueGuildRanks<T extends Prisma.guild_ranksFindUniqueArgs>(args: T): Promise<Prisma.guild_ranksGetPayload<T>> {
	try {
		const guildRanks = await prisma.guild_ranks.findUnique(args);
		return guildRanks as Prisma.guild_ranksGetPayload<T>;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export async function CreateOneGuildRanks<T extends Prisma.guild_ranksCreateArgs>(args: T): Promise<Prisma.guild_ranksGetPayload<T>> {
	try {
		const guildRanks = await prisma.guild_ranks.create(args);
		return guildRanks as Prisma.guild_ranksGetPayload<T>;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export async function UpdateOneGuildRanks<T extends Prisma.guild_ranksUpdateArgs>(args: T): Promise<Prisma.guild_ranksGetPayload<T>> {
	try {
		const guildRanks = await prisma.guild_ranks.update(args);
		return guildRanks as Prisma.guild_ranksGetPayload<T>;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export async function DeleteOneGuildRanks<T extends Prisma.guild_ranksDeleteArgs>(args: T): Promise<Prisma.guild_ranksGetPayload<T>> {
	try {
		const guildRanks = await prisma.guild_ranks.delete(args);
		return guildRanks as Prisma.guild_ranksGetPayload<T>;
	} catch (error) {
		console.error(error);
		throw error;
	}
}
