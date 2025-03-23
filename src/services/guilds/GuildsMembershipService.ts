"use server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export async function GetManyGuildMemberships<T extends Prisma.guild_membershipFindManyArgs>(args: T): Promise<Prisma.guild_membershipGetPayload<T>[]> {
	try {
		const guildMemberships = await prisma.guild_membership.findMany(args);
		return guildMemberships as Prisma.guild_membershipGetPayload<T>[];
	} catch (e) {
		const error: Error = e as Error;
		console.error("Error al obtener guildMemberships:", error);
		throw error;
	}
}

export async function CreateGuildMembership<T extends Prisma.guild_membershipCreateArgs>(args: T): Promise<Prisma.guild_membershipGetPayload<T>> {
	try {
		const guildMembership = await prisma.guild_membership.create(args);
		return guildMembership as Prisma.guild_membershipGetPayload<T>;
	} catch (e) {
		const error: Error = e as Error;
		console.error("Error al crear guildMembership:", error);
		throw error;
	}
}
