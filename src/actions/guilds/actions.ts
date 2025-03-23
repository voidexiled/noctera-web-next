"use server";
// This is unused code
import { randomUUID } from "node:crypto";

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import { revalidatePath } from "next/cache";

import { redirect } from "next/navigation";
import { z } from "zod";

const DEFAULT_LOGO_NAME = "default.gif";
const GUILD_SCHEMA = z.object({
	description: z.string(),
	motd: z.string(),
});

async function revalidateAndRedirect(guildName: string, pathPrefix = "/guilds") {
	revalidatePath(`${pathPrefix}/${guildName}`);
	redirect(`${pathPrefix}/${guildName}`);
}

function handleDatabaseError(action: string): { message: string } {
	return { message: `Database Error: Failed to ${action}.` };
}

export async function createGuild(formData: { name: string; leader: string }) {
	try {
		const creationData = {
			name: formData.name,
			ownerid: Number(formData.leader),
			logo_name: DEFAULT_LOGO_NAME,
			creationdata: dayjs().unix(),
			description: "",
			// guild_ranks: {
			// 	createMany: {
			// 		data: [
			// 			{ name: "Leader", level: 3 },
			// 			{ name: "Vice Leader", level: 2 },
			// 			{ name: "Member", level: 1 },
			// 		],
			// 		skipDuplicates: true,
			// 	},
			// },
		};

		await prisma.guilds.create({ data: creationData });
		await revalidateAndRedirect(formData.name);
	} catch (e) {
		const error: Error = e as Error;
		return handleDatabaseError(error.message);
	}
}

export async function listPlayers(account_id: number) {
	try {
		const players = await prisma.players.findMany({
			where: { account_id, level: { gte: 8 } },
			select: { id: true, name: true },
		});
		return { players };
	} catch (e) {
		const error: Error = e as Error;
		return handleDatabaseError(error.message);
	}
}

export async function updateGuild(id: number, formData: FormData) {
	try {
		const { description, motd } = GUILD_SCHEMA.parse({
			description: formData.get("description"),
			motd: formData.get("motd"),
		});

		const file = formData.get("banner") as File | null;
		let logo_name: string | undefined;

		if (file && typeof file !== "string") {
			const bytes = await file.bytes();
			const buffer = Uint8Array.from(bytes);
			const fileName = `${randomUUID()}-${file.name}`;
			//const path = join("public", "guilds", fileName);

			const uploadDir = join(process.cwd(), "uploads", "guilds");
			await mkdir(uploadDir, { recursive: true });

			const filePath = join(uploadDir, fileName);
			await writeFile(filePath, buffer);
			logo_name = fileName;
		}

		const guild = await prisma.guilds
			.update({
				where: { id },
				data: { logo_name, description, motd: motd ?? "" },
			})
			.then((res) => {
				return res;
			})
			.catch((err) => {
				const error = err as Error;
				console.error(error);
				throw error;
			});

		await revalidateAndRedirect(guild.name);
	} catch (e) {
		const error: Error = e as Error;
		console.error(error);
		return handleDatabaseError(error.message);
	}
}

export async function deleteGuild(id: number) {
	try {
		await prisma.guilds.delete({ where: { id } });
		await revalidateAndRedirect("");
	} catch (e) {
		const error: Error = e as Error;
		return handleDatabaseError(error.message);
	}
}

async function handlePlayerGuildInvite(
	method: "delete",
	{ guild_id, player_id }: { guild_id: number; player_id: number },
) {
	try {
		const data = await prisma.guild_invites[method]({
			where: { player_id_guild_id: { guild_id, player_id } },
			select: { guilds: { select: { name: true } } },
		});
		await revalidateAndRedirect(data.guilds.name);
	} catch (e) {
		const error: Error = e as Error;
		return handleDatabaseError(error.message);
	}
}

export const RemoverPlayerToGuild = async (params: { guild_id: number; player_id: number }) => {
	return await handlePlayerGuildInvite("delete", params);
};

export const CancelInvite = async (params: { guild_id: number; player_id: number }) => {
	return await handlePlayerGuildInvite("delete", params);
};
