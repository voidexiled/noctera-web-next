"use server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { toast } from "sonner";

export async function getGuildByName(guild_name: string) {
	try {
		const findedGuild = await prisma.guilds.findFirst({
			where: {
				AND: [{ name: guild_name }],
			},
			include: {
				players: {
					select: {
						id: true,
						name: true,
					},
				},
				guild_membership: {
					include: {
						players: {
							select: {
								id: true,
								name: true,
								vocation: true,
								level: true,
							},
						},
						guild_ranks: true,
					},
				},
				guild_invites: {
					include: {
						players: {
							select: {
								name: true,
								id: true,
							},
						},
					},
				},
				guild_ranks: true,
			},
		});
		if (!findedGuild) throw new Error("Guild not found");
		return findedGuild;
	} catch (err) {
		const error = err as Error;
		toast.error(error.message);
	}
}

// ! TODO: Implement this type of services
export async function getManyGuilds<T extends Prisma.guildsFindManyArgs>(
	args: T,
): Promise<Prisma.guildsGetPayload<T>[]> {
	try {
		const guilds = await prisma.guilds.findMany(args);
		return guilds as Prisma.guildsGetPayload<T>[];
	} catch (error) {
		console.error("Error al obtener guilds:", error);
		throw error;
	}
}
