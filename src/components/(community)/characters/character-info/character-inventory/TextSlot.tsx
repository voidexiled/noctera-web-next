type TextSlotProps = {
	label: string;
	value: string | number;
};

export const TextSlot = ({ label, value }: TextSlotProps) => {
	return (
		<div className="border/50 relative flex h-10 w-10 border-collapse flex-col justify-center text-center text-[0.65rem]">
			<img
				src="/animated-items/empty_slot.gif"
				className="absolute top-0 left-0 h-full w-full object-cover object-center"
				alt=""
			/>
			<span className="relative z-[1]">{value}</span>
			<span className="relative z-[1]">{label}</span>
		</div>
	);
};
