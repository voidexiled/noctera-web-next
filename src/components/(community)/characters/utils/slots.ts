import type {
	InventorySlotImage,
	InventorySlotPosition,
} from "@/components/(community)/characters/types/character";

export const SLOTS: Record<string, InventorySlotPosition> = {
	HELMET: 1,
	NECKLACE: 2,
	BACKPACK: 3,
	ARMOR: 4,
	HANDLEFT: 6,
	HANDRIGHT: 5,
	LEGS: 7,
	BOOTS: 8,
	RING: 9,
	AMMO: 10,
};

export const EMPTY_SLOTS: InventorySlotImage[] = [
	{ slotPositionId: SLOTS.NECKLACE, imagePath: "no_necklace" },
	{ slotPositionId: SLOTS.HELMET, imagePath: "no_helmet" },
	{ slotPositionId: SLOTS.BACKPACK, imagePath: "no_backpack" },
	{ slotPositionId: SLOTS.HANDLEFT, imagePath: "no_handright" },
	{ slotPositionId: SLOTS.ARMOR, imagePath: "no_armor" },
	{ slotPositionId: SLOTS.HANDRIGHT, imagePath: "no_handleft" },
	{ slotPositionId: SLOTS.RING, imagePath: "no_ring" },
	{ slotPositionId: SLOTS.LEGS, imagePath: "no_legs" },
	{ slotPositionId: SLOTS.AMMO, imagePath: "no_ammo" },
	{ slotPositionId: SLOTS.BOOTS, imagePath: "no_boots" },
];
