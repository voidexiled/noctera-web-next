"use server";

import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export async function GetManyGuildInvitations<T extends Prisma.guild_invitesFindManyArgs>(args: T): Promise<Prisma.guild_invitesGetPayload<T>[]> {
	try {
		const guildInvitations = await prisma.guild_invites.findMany(args);
		return guildInvitations as Prisma.guild_invitesGetPayload<T>[];
	} catch (e) {
		console.error(e);
		throw e;
	}
}

export async function DeleteGuildInvitation<T extends Prisma.guild_invitesDeleteArgs>(args: T): Promise<Prisma.guild_invitesGetPayload<T>> {
	try {
		const guildInvitation = await prisma.guild_invites.delete(args);
		return guildInvitation as Prisma.guild_invitesGetPayload<T>;
	} catch (e) {
		console.error(e);
		throw e;
	}
}
