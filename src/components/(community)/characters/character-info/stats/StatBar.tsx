type StatBarProps = {
	current: number;
	max: number;
	colorClass: string;
	label: string;
};

export const StatBar = ({ current, max, colorClass, label }: StatBarProps) => (
	<div className="grid grid-cols-[5rem_1fr] justify-center gap-2">
		<span>{label}:</span>
		<div className="grid grid-rows-[1fr] gap-1 text-xs">
			<div className="relative flex h-6 flex-row items-center overflow-hidden rounded-lg text-xs">
				<div
					className={`absolute h-full self-start ${colorClass}`}
					style={{ width: `${(current / max) * 100}%` }}
				/>
				<span className="relative z-10 w-full text-center">
					{`${current}/${max} (${((current / max) * 100).toFixed(2)}%)`}
				</span>
			</div>
		</div>
	</div>
);
