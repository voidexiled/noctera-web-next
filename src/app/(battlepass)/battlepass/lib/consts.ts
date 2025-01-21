import type { BATTLEPASS_RANK_ACCESS } from "@prisma/client";

export const RANK_PRIORITY: Record<BATTLEPASS_RANK_ACCESS, number> = {
	FREE: 0,
	VIP_SILVER: 1,
	VIP_GOLD: 2,
	DIAMOND: 3,
};