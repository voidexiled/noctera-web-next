import { EMPTY_SLOTS } from "@/components/(community)/characters/utils/slots";

type InventorySlotProps = {
	src: string;
};

export const InventorySlot = ({ src }: InventorySlotProps) => {
	const isEmpty = Array.from(EMPTY_SLOTS.values()).some((slot) => slot.imagePath === src);

	return (
		<div className="border/50 relative h-10 w-10 border-collapse ">
			{isEmpty ? (
				<img src={src} alt="" className="h-full w-full object-cover object-center" />
			) : (
				<>
					<img
						src="/animated-items/empty_slot.gif"
						className="absolute top-0 left-0 h-full w-full object-cover object-center"
						alt=""
					/>
					<img
						src={src}
						alt=""
						className="relative z-[1] h-full w-full object-cover object-center"
					/>
				</>
			)}
		</div>
	);
};
