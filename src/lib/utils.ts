import type { CountdownProps } from "@/lib/lib";
import type { ConfigLua } from "@/utils/readConfigLua";
import { type ClassValue, clsx } from "clsx";
import type { now } from "lodash";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export default function getServerSaveTime(lua: ConfigLua<string>) {
	if (!lua?.globalServerSaveTime)
		return { serverSaveHours: 0, serverSaveMinutes: 0, serverSaveSeconds: 0 };
	const globalServerSaveTime = lua.globalServerSaveTime.split(":").map(Number);
	const [hours, minutes, seconds] = globalServerSaveTime;

	return {
		serverSaveHours: hours,
		serverSaveMinutes: minutes,
		serverSaveSeconds: seconds,
	};
}

export function calculateTimeRemainingUntil({
	hour = 0,
	min = 0,
	sec = 0,
	nowDate,
}: CountdownProps & { nowDate: Date }) {
	const targetTime = new Date(nowDate);

	targetTime.setHours(hour, min, sec, 0);

	if (nowDate >= targetTime) {
		targetTime.setDate(targetTime.getDate() + 1);
	}

	const timeRemaining = targetTime.getTime() - nowDate.getTime();

	const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
	const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
	const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

	return { hours, minutes, seconds };
}
