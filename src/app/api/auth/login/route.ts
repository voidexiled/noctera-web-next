import fs from "node:fs/promises";
import path from "node:path";
import { status } from "@/app/layout";
import configLua from "@/hooks/configLua";
import { prisma } from "@/lib/prisma";
import { comparePassword } from "@/utils/functions/criptoPassword";
import type { accounts } from "@prisma/client";
import { compare, compareSync } from "bcrypt";
import { parse } from "date-fns";
import { toInteger } from "lodash";
import { type NextRequest, NextResponse } from "next/server";

const lua = configLua();

function sendError(msg: string) {
	return NextResponse.json({
		errorCode: 3,
		errorMessage: msg,
	});
}

async function checkPremium(id: accounts["id"], lastDay: accounts["lastday"]) {
	const timeNow = Date.now();
	let _lastDay = lastDay;
	let premDays = 0;
	let daysLeft = 0;
	let timeLeft = 0;
	if (_lastDay < timeNow) {
		premDays = 0;
		_lastDay = 0;
	} else if (_lastDay === 0) {
		premDays = 0;
	} else {
		daysLeft = toInteger((_lastDay - timeNow) / 86400);
		timeLeft = toInteger((_lastDay - timeNow) % 86400);
		if (daysLeft > 0) {
			premDays = daysLeft;
		} else if (timeLeft > 0) {
			premDays = 1;
		} else {
			premDays = 0;
			_lastDay = 0;
		}
	}

	await prisma.accounts.update({
		where: { id },
		data: {
			premdays: premDays,
			lastday: _lastDay,
		},
	});
	return _lastDay;
}

type ActionType =
	| "news"
	| "cacheinfo"
	| "eventschedule"
	| "boostedcreature"
	| "login";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		body;
		const { type: actionType } = body;
		// if (!actionType) {
		//     return NextResponse.json({
		//         errorCode: 3,
		//         errorMessage: 'Unrecognized event',
		//     });
		// } else {
		//     if (actionType === 'news') {
		//         return await handleNews()
		//     }
		// }

		switch (actionType) {
			case "news":
				("news");
				return await handleNews();
			case "cacheinfo":
				("cacheinfo");
				return await handleCacheInfo();
			case "eventschedule":
				("eventschedule");
				return await handleEventSchedule();
			case "boostedcreature":
				("boostedcreature");
				return await handleBoostedCreature();
			case "login":
				("login");
				return await handleLogin(body);
			default:
				("default");
				return NextResponse.json({
					errorCode: 3,
					errorMessage: `Unrecognized event ${actionType}.`,
				});
		}
	} catch (error) {
		console.error("Error during login: ", error);
		return NextResponse.json(
			{ errorCode: 500, errorMessage: error },
			{ status: 500 },
		);
	}
}

async function handleBoostedCreature() {
	const creatureBoost = await prisma.boosted_creature.findMany({});
	const bossBoost = await prisma.boosted_boss.findMany({});
	return NextResponse.json({
		boostedcreature: true,
		creatureraceid: Number.parseInt(creatureBoost[0].raceid),
		bossraceid: Number.parseInt(bossBoost[0].raceid),
	});
}

type EventScheduleType = {
	events: {
		name: string;
		startdate: string;
		enddate: string;
		ingame: Record<string, number | boolean>;
		description: string;
		colors: {
			colordark: string;
			colorlight: string;
		};
		details: {
			displaypriority: number;
			isseasonal: number;
			specialevent: number;
		};
	}[];
};

function parseDate(date: string) {
	const firstPhase = parse(date, "MM/dd/yyyy", new Date());
	firstPhase;
	const secondPhase = firstPhase.getTime();
	secondPhase;
	const thirdPhase = secondPhase;
	thirdPhase;
	const fourthPhase = Math.floor(new Date(date).getTime() / 1000);
	fourthPhase;
	return fourthPhase;

	//return Math.floor(parse(date, "MM/dd/yyyy", new Date()).getTime() / 1000)
}

async function handleEventSchedule() {
	//const json_file_path = lua['']
	try {
		const server_path = process.env.SERVER_PATH! || "";
		//const json_file_path = `${path.resolve("C:/Users/jalomo/Downloads/13.41 server/canary/data/json/eventscheduler/events.json")}`
		const json_file_path = `${server_path}/data/json/eventscheduler/events.json`;

		const fileContents = await fs.readFile(json_file_path, "utf8");

		const events: EventScheduleType = JSON.parse(fileContents);

		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const parsedEvents = events.events.map((event: any) => {
			const parsedEvent = {
				colorlight: event.colors.colorlight,
				colordark: event.colors.colordark,
				description: event.description,
				displaypriority: event.details.displaypriority,
				enddate: parseDate(event.enddate),
				isseasonal: event.details.isseasonal !== 0,
				name: event.name,
				startdate: parseDate(event.startdate),
				specialevent: event.details.specialevent !== 0,
				//ingame: event.ingame,
			};
			return parsedEvent;
		});
		4;

		return NextResponse.json({
			eventlist: parsedEvents,
			lastupdatetimestamp: Math.floor(Date.now() / 1000),
		});
	} catch (error) {
		return NextResponse.json(
			{ errorCode: 3, errorMessage: error },
			{ status: 500 },
		);
	}
}

async function handleCacheInfo() {
	const playersOnline = await prisma.players_online.count();
	return NextResponse.json({
		playersonline: playersOnline,
		twitchstreams: 0,
		twitchviewer: 0,
		gamingyoutubestreams: 0,
		gamingyoutubeviewer: 0,
	});
}

async function handleNews() {
	//const compendiumData = await jsonCompendium()
	return Response.json({}, { status: 200 });
}

type WorldType = {
	id: number;
	name: string;
	externaladdress: string;
	externaladdressprotected: string;
	externaladdressunprotected: string;
	externalport: number;
	externalportprotected: number;
	externalportunprotected: number;
	previewstate: number;
	location: string;
	anticheatprotection: boolean;
	pvptype: string;
	istournamentworld: boolean;
	restrictedstore: boolean;
	currenttournamentphase: number;
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
async function handleLogin(body: any) {
	// biome-ignore lint/complexity/useLiteralKeys: <explanation>
	const ip = lua["ip"].split(" ")[0];
	// biome-ignore lint/complexity/useLiteralKeys: <explanation>
	const port = Number.parseInt(lua["gameProtocolPort"]);
	const { email, password }: { email: string; password: string } = body;

	// default world info
	const world: WorldType = {
		id: 0,
		// biome-ignore lint/complexity/useLiteralKeys: <explanation>
		name: lua["serverName"],
		externaladdress: ip,
		externaladdressprotected: ip,
		externaladdressunprotected: ip,
		externalport: port,
		externalportprotected: port,
		externalportunprotected: port,
		previewstate: 0,
		location: "BRA",
		anticheatprotection: false,
		// biome-ignore lint/complexity/useLiteralKeys: <explanation>
		pvptype: lua["worldType"],
		istournamentworld: false,
		restrictedstore: false,
		currenttournamentphase: 2,
	};

	if (!email || !password) {
		return NextResponse.json(
			{ errorCode: 3, errorMessage: "Email and password are required" },
			{ status: 200 },
		);
	}

	const account = await prisma.accounts.findFirst({
		where: { email },
		include: {
			players: {
				select: {
					name: true,
					sex: true,
					istutorial: true,
					level: true,
					looktype: true,
					vocation: true,
					lookhead: true,
					lookbody: true,
					looklegs: true,
					lookfeet: true,
					lookaddons: true,
					ismain: true,
					isreward: true,
				},
				where: { deletion: 0 },
			},
		},
	});

	if (!account) {
		return NextResponse.json(
			{ errorCode: 3, errorMessage: "Email or password is incorrect." },
			{ status: 200 },
		);
	}

	const passwordsMatched = comparePassword(
		password,
		account?.password as string,
	);

	if (!account || !passwordsMatched) {
		return NextResponse.json(
			{ errorCode: 3, errorMessage: "Email or password is incorrect." },
			{ status: 200 },
		);
	}

	// if (account.email_verified === false) {
	//     return NextResponse.json(
	//         {
	//             errorCode: 3,
	//             errorMessage: 'You need to verify your account. Check your email.',
	//         },
	//         { status: 400 },
	//     );
	// }

	const getVocation = (vocation: number) => {
		const vocations: Record<number, string> = {
			0: "None",
			1: "Sorcerer",
			2: "Druid",
			3: "Paladin",
			4: "Knight",
			5: "Master Sorcerer",
			6: "Elder Druid",
			7: "Royal Paladin",
			8: "Elite Knight",
		};
		return vocations[vocation];
	};

	const characters = account.players.map((player) => ({
		worldid: 0,
		name: player.name,
		ismale: player.sex === 1,
		tutorial: !!player.istutorial,
		level: player.level,
		vocation: getVocation(player.vocation),
		outfitid: player.looktype,
		headcolor: player.lookhead,
		torsocolor: player.lookbody,
		legscolor: player.looklegs,
		detailcolor: player.lookfeet,
		addonsflags: player.lookaddons,
		ishidden: false,
		istournamentparticipant: false,
		ismaincharacter: player.ismain,
		// biome-ignore lint/complexity/noUselessTernary: <explanation>
		dailyrewardstate: player.isreward ? true : false,
		remainingdailytournamentplaytime: 0,
	}));

	const queryPremdays = await prisma.accounts.findUnique({
		where: { id: account.id },
		select: {
			premdays: true,
			lastday: true,
		},
	});

	let premU = 0;
	if (queryPremdays) {
		premU = await checkPremium(account.id, queryPremdays.lastday);
	} else {
		return NextResponse.json({
			errorCode: 3,
			errorMesssage:
				"Error while fetching your account data. Please contact admin.",
		});
	}

	const session = {
		sessionkey: `${email}\n${password}`,
		lastlogintime: account.lastday ? account.lastday : 0,
		ispremium: account.premdays > 0,
		premiumuntil: premU,
		status: "active",
		returnernotification: false,
		showrewardnews: true,
		isreturner: true,
		fpstracking: false,
		optiontracking: false,
		tournamentticketpurchasestate: 0,
		emailcoderequest: false,
	};

	return NextResponse.json({
		session,
		playdata: { worlds: [world], characters },
	});
}
