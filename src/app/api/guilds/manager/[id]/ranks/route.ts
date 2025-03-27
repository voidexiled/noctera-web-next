import type {
	GuildsManagerIdRanksDELETERequest,
	GuildsManagerIdRanksDELETEResponse,
	GuildsManagerIdRanksGETResponse,
	GuildsManagerIdRanksPOSTRequest,
	GuildsManagerIdRanksPOSTResponse,
	GuildsManagerIdRanksPUTRequest,
	GuildsManagerIdRanksPUTResponse,
} from "@/app/api/types";
import { ManageUserSession } from "@/lib/helpers/api";
import { CreateOneGuildRanks, DeleteOneGuildRanks, UpdateOneGuildRanks } from "@/services/guilds/GuildRanksService";
import { GetUniqueGuilds } from "@/services/guilds/GuildsService";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

type Params = Promise<{ id: string }>;

export async function POST(request: Request, params: Params) {
	try {
		const body: GuildsManagerIdRanksPOSTRequest = await request.json();

		await ManageUserSession((session) => {
			// ! Evaluate if can create a rank ( need to be leader of the guild )
			return true;
		});

		const guildId = body.guild_id;

		const foundGuild = await GetUniqueGuilds({
			where: { id: +guildId },
			select: { id: true, name: true },
		});

		if (!foundGuild) return NextResponse.json({ error: "Guild not found." }, { status: 400 });

		const rank_created = await CreateOneGuildRanks({
			data: {
				level: 1,
				name: body.rank,
				guild_id: body.guild_id,
			},
		});

		if (!rank_created) return NextResponse.json({ error: "Error creating rank." }, { status: 400 });

		const response: GuildsManagerIdRanksPOSTResponse = {
			rank: rank_created.name,
		};

		revalidatePath(`/guilds/${foundGuild.name}`);
		return NextResponse.json(response, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

export async function GET(request: Request, params: Params) {
	try {
		const bodyParams = await params;
		const guildId = bodyParams.id;

		await ManageUserSession((session) => {
			// ! Evaluate if can list the ranks of the guild
			return true;
		});

		const foundGuild = await GetUniqueGuilds({
			where: { id: +guildId },
			include: {
				guild_ranks: true,
			},
		});

		if (!foundGuild) return NextResponse.json({ error: "Guild not found." }, { status: 400 });

		const response: GuildsManagerIdRanksGETResponse = {
			ranks: foundGuild.guild_ranks,
		};

		revalidatePath(`/guilds/${foundGuild.name}`);
		return NextResponse.json(response, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

export async function PUT(request: Request, params: Params) {
	try {
		const body: GuildsManagerIdRanksPUTRequest = await request.json();
		const { guild_id, ranks } = body;
		await ManageUserSession((session) => {
			// ! Evaluate if can update the ranks of the guild
			return true;
		});

		const foundGuild = await GetUniqueGuilds({
			where: { id: guild_id },
		});

		if (!foundGuild) return NextResponse.json({ error: "Guild not found." }, { status: 400 });

		ranks.map(async (rank) => {
			await UpdateOneGuildRanks({
				where: { id: rank.id },
				data: rank,
			});
		});

		const response: GuildsManagerIdRanksPUTResponse = undefined;

		revalidatePath(`/guilds/${foundGuild.name}`);
		return NextResponse.json(response, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

export async function DELETE(request: Request, params: Params) {
	try {
		const bodyParams = await params;
		const body: GuildsManagerIdRanksDELETERequest = await request.json();

		await ManageUserSession((session) => {
			// ! Evaluate if can delete the ranks of the guild
			return true;
		});

		const guildId = bodyParams.id;

		const findGuild = await GetUniqueGuilds({
			where: { id: +guildId },
		});

		if (!findGuild) return NextResponse.json({ error: "Guild not found." }, { status: 400 });

		const deletedRank = await DeleteOneGuildRanks({
			where: { id: body.rank_id },
			select: {
				id: true,
				name: true,
			},
		});

		if (!deletedRank) return NextResponse.json({ error: "Error deleting rank." }, { status: 400 });

		const response: GuildsManagerIdRanksDELETEResponse = {
			deleted_rank: deletedRank.name,
		};

		revalidatePath(`/guilds/${findGuild.name}`);
		return NextResponse.json(response, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
