"use server";
import configLua from "@/hooks/useConfigLua";
import { prisma } from "@/lib/prisma";
import { StatusServer } from "@/utils/statusServer";

const lua = configLua();

export const getServerStatus = async () => {
	try {
		const statusServer = new StatusServer();
		const host = lua.ip.split(" ")[0];
		const port = +lua.statusProtocolPort;
		return await statusServer.getStatus(host, port);
	} catch (error) {
		console.error("Error checking server status:", error);
		return null;
	}
};

export const getTotalOnline = async () => {
	try {
		return await prisma.players_online.count();
	} catch (error) {
		console.error("Error counting online players:", error);
		return 0;
	}
};
