import { LogsInfo } from "@/components/(news)/lib/data";
import type { POST_TYPE } from "@prisma/client";

export function getLogIcon(logType: POST_TYPE, size: "small" | "default" = "default") {
	return "/icons/logs/".concat(LogsInfo[logType][size]);
}
