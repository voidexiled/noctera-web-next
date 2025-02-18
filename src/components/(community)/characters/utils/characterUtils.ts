/* Player Inventory */

import type {
	InventorySlotImage,
	InventorySlotPosition,
	PlayerWithItems,
} from "@/components/(community)/characters/types/character";
import { EMPTY_SLOTS, SLOTS } from "@/components/(community)/characters/utils/slots";
import { pageConfig } from "@/lib/config";
import type { player_items, players } from "@prisma/client";

const animatedItemsPath = pageConfig.paths.animated_items;

export function retrieveEquippedItemsFromCharacter(character: PlayerWithItems) {
	const MIN_INVENTORY_SLOT = 1;
	const MAX_INVENTORY_SLOT = 10;

	return character.player_items.filter(
		(item) => item.pid >= MIN_INVENTORY_SLOT && item.pid <= MAX_INVENTORY_SLOT,
	);
}

export function getFallbackImageForEmptySlot(slotPositionId: InventorySlotPosition) {
	const emptySlot = EMPTY_SLOTS.find((slot) => slot.slotPositionId === slotPositionId);
	return emptySlot?.imagePath || "default_empty_slot";
}

export function resolveItemImagePathBySlot(
	characterItems: player_items[],
	slotPositionId: InventorySlotPosition,
): string {
	const itemTypeIdInSlot = characterItems.find((item) => item.pid === slotPositionId)?.itemtype;

	if (!itemTypeIdInSlot) {
		const emptySlotImage = getFallbackImageForEmptySlot(slotPositionId);
		return `${animatedItemsPath}/${emptySlotImage}.gif`;
	}

	return `${animatedItemsPath}/${itemTypeIdInSlot}.gif`;
}

export function generateInventorySlotImageMap(
	characterItems: player_items[],
): InventorySlotImage[] {
	const inventorySlots: InventorySlotPosition[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

	return inventorySlots.map((slotPositionId) => ({
		slotPositionId,
		imagePath: resolveItemImagePathBySlot(characterItems, slotPositionId),
	}));
}

export function findEquippedItemImageBySlot(
	inventorySlotImages: InventorySlotImage[],
	targetSlotId: InventorySlotPosition,
) {
	return inventorySlotImages.find((slot) => slot.slotPositionId === targetSlotId)?.imagePath || "";
}

/*
Player

*/
export function getExpForLevel(level: number): number {
	const tempLevel = level - 1;
	return Math.floor(
		(50 * tempLevel * tempLevel * tempLevel - 150 * tempLevel * tempLevel + 400 * tempLevel) / 3,
	);
}

export function calculateExperience(playerExperience: bigint, playerLevel: number) {
	const expCurrent = BigInt(getExpForLevel(playerLevel));
	const expNext = BigInt(getExpForLevel(playerLevel + 1));
	const expLeft = expNext - playerExperience;
	const expLeftPercent = Math.max(
		0,
		Math.min(100, Number(((playerExperience - expCurrent) * BigInt(100)) / (expNext - expCurrent))),
	);
	return {
		expLeft,
		expLeftPercent,
	};
}

export const getLoyaltyRankTitle = (raking: number) => {
	if (raking >= 5000 && raking < 10000) {
		return "John Cena";
	}
	if (raking >= 10000 && raking < 15000) {
		return "Bruce Lee";
	}
	if (raking >= 15000 && raking < 20000) {
		return "Jackie Chan";
	}
	if (raking >= 20000 && raking < 25000) {
		return "Rocky Balboa";
	}
	if (raking >= 25000 && raking < 30000) {
		return "Van Damme";
	}
	if (raking >= 30000 && raking < 35000) {
		return "The Rock";
	}
	if (raking >= 35000 && raking < 40000) {
		return "Arnold Schwarzenegger";
	}
	if (raking >= 40000 && raking < 45000) {
		return "Vin Diesel";
	}
	if (raking >= 45000 && raking < 50000) {
		return "Latrel";
	}
	if (raking >= 50000) {
		return "Chuck Norris";
	}
	return "No Ranking";
};
