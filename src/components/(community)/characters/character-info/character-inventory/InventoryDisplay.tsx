import { InventorySlot } from "@/components/(community)/characters/character-info/character-inventory/InventorySlot";
import { TextSlot } from "@/components/(community)/characters/character-info/character-inventory/TextSlot";
import type {
	InventorySlotImage,
	PlayerWithItems,
} from "@/components/(community)/characters/types/character";
import {
	findEquippedItemImageBySlot,
	generateInventorySlotImageMap,
	retrieveEquippedItemsFromCharacter,
} from "@/components/(community)/characters/utils/characterUtils";
import { SLOTS } from "@/components/(community)/characters/utils/slots";
import type { player_items } from "@prisma/client";

export const InventoryDisplay = ({ player }: { player: PlayerWithItems }) => {
	const playerInventory = retrieveEquippedItemsFromCharacter(player);

	const inventoryImages: InventorySlotImage[] = generateInventorySlotImageMap(playerInventory);

	return (
		<div className="grid grid-rows-[auto_1fr] gap-2 p-2">
			<span className="text-center text-sm">Inventory</span>
			<div className="mx-auto grid border-collapse grid-cols-3 grid-rows-4 divide-border/60 border">
				<InventorySlot src={findEquippedItemImageBySlot(inventoryImages, SLOTS.NECKLACE)} />
				<InventorySlot src={findEquippedItemImageBySlot(inventoryImages, SLOTS.HELMET)} />
				<InventorySlot src={findEquippedItemImageBySlot(inventoryImages, SLOTS.BACKPACK)} />
				<InventorySlot src={findEquippedItemImageBySlot(inventoryImages, SLOTS.HANDLEFT)} />
				<InventorySlot src={findEquippedItemImageBySlot(inventoryImages, SLOTS.ARMOR)} />
				<InventorySlot src={findEquippedItemImageBySlot(inventoryImages, SLOTS.HANDRIGHT)} />
				<InventorySlot src={findEquippedItemImageBySlot(inventoryImages, SLOTS.RING)} />
				<InventorySlot src={findEquippedItemImageBySlot(inventoryImages, SLOTS.LEGS)} />
				<InventorySlot src={findEquippedItemImageBySlot(inventoryImages, SLOTS.AMMO)} />
				<TextSlot label="Soul" value={player.soul} />
				<InventorySlot src={findEquippedItemImageBySlot(inventoryImages, SLOTS.BOOTS)} />
				<TextSlot label="Cap" value={player.cap} />
			</div>
		</div>
	);
};
