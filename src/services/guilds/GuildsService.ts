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
	} catch (e) {
		const error: Error = e as Error;
		toast.error(error.message);
		throw error;
	}
}

// ! TODO: Implement this type of services
export async function GetManyGuilds<T extends Prisma.guildsFindManyArgs>(args: T): Promise<Prisma.guildsGetPayload<T>[]> {
	try {
		const guilds = await prisma.guilds.findMany(args);
		return guilds as Prisma.guildsGetPayload<T>[];
	} catch (e) {
		const error: Error = e as Error;
		console.error("Error al obtener guilds:", error);
		throw error;
	}
}

export async function CreateOneGuild<T extends Prisma.guildsCreateArgs>(args: T): Promise<Prisma.guildsGetPayload<T>> {
	try {
		const guild = await prisma.guilds.create(args);
		return guild as Prisma.guildsGetPayload<T>;
	} catch (e) {
		const error: Error = e as Error;
		console.error("Error al crear guild:", error);
		throw error;
	}
}

export async function GetFirstGuilds<T extends Prisma.guildsFindFirstArgs>(args: T): Promise<Prisma.guildsGetPayload<T>> {
	try {
		const guild = await prisma.guilds.findFirst(args);
		return guild as Prisma.guildsGetPayload<T>;
	} catch (e) {
		const error: Error = e as Error;
		console.error("Error al obtener el primer guild:", error);
		throw error;
	}
}

export async function GetUniqueGuilds<T extends Prisma.guildsFindUniqueArgs>(args: T): Promise<Prisma.guildsGetPayload<T>> {
	try {
		const guild = await prisma.guilds.findUnique(args);
		return guild as Prisma.guildsGetPayload<T>;
	} catch (e) {
		const error: Error = e as Error;
		console.error("Error al obtener el guild único:", error);
		throw error;
	}
}

export async function DeleteOneGuilds<T extends Prisma.guildsDeleteArgs>(args: T): Promise<Prisma.guildsGetPayload<T>> {
	try {
		const guild = await prisma.guilds.delete(args);
		return guild as Prisma.guildsGetPayload<T>;
	} catch (e) {
		const error: Error = e as Error;
		console.error("Error al eliminar el guild:", error);
		throw error;
	}
}
