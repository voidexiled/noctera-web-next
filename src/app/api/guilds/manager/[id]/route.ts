import type { DeleteGuildResponse } from "@/components/(community)/guilds/types/guilds";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

type Params = Promise<{ id: string }>;
const GetGuild = async (request: Request, { params }: { params: Params }) => {
	try {
		const guildId = (await params).id;
		const guild = await prisma.guilds.findFirst({
			where: { id: Number(guildId) },
			include: {
				guild_membership: true,
				guild_invites: true,
			},
		});

		return NextResponse.json({
			guild_membership: guild?.guild_membership,
			guild_invites: guild?.guild_invites,
		});
	} catch (error) {
		return NextResponse.json({ message: "Internal server error" }, { status: 500 });
	}
};

const UpdateSchema = z.object({
	description: z.string(),
	motd: z.string(),
});

// This is not used
// replaced by actions/guilds/actions.ts -> updateGuild
const UpdateGuild = async (request: Request) => {
	try {
		const { description, motd } = UpdateSchema.parse(await request.json());

		const session = await getServerSession(authOptions);
		if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

		// const findGuild = await prisma.guilds.findUnique({ where: { id } })
		// if (!findGuild) return NextResponse.json({ message: 'Guild not found.' }, { status: 400 });

		// await prisma.guilds.update({ where:})

		return NextResponse.json({});
	} catch (error) {
		return NextResponse.json({ message: "Internal server error" }, { status: 500 });
	}
};

const DeleteGuild = async (request: Request, { params }: { params: Params }) => {
	try {
		const session = await getServerSession(authOptions);
		if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

		const guildId = (await params).id;

		const findGuild = await prisma.guilds.findUnique({
			where: { id: +guildId },
		});
		if (!findGuild) return NextResponse.json({ message: "Guild not found" }, { status: 404 });

		const findPlayer = await prisma.players.findUnique({
			where: { id: findGuild.ownerid },
		});
		if (!findPlayer)
			return NextResponse.json({ message: "Guild owner not found" }, { status: 404 });

		if (+session.user.id !== findPlayer.account_id)
			return NextResponse.json(
				{ message: "You need to be the owner of the guild to delete it" },
				{ status: 403 },
			);

		await prisma.guilds.delete({
			where: { id: +guildId },
			select: {
				id: true,
				name: true,
			},
		});

		const dataResponse: DeleteGuildResponse = {
			guild_id: +guildId,
			guild_name: findGuild.name,
		};

		return NextResponse.json(dataResponse, { status: 200 });
	} catch (error) {
		return NextResponse.json({ message: "Internal server error" }, { status: 500 });
	}
};

export { GetGuild as GET, UpdateGuild as PUT, DeleteGuild as DELETE };
