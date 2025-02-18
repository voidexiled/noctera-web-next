import { calculateExperience } from "@/components/(community)/characters/utils/characterUtils";

// Components/CharacterStats/ExperienceDisplay.tsx
type ExperienceDisplayProps = {
	experience: bigint;
	level: number;
};

export const ExperienceDisplay = ({ experience, level }: ExperienceDisplayProps) => {
	const { expLeft, expLeftPercent } = calculateExperience(experience, level);

	return (
		<div className="grid grid-rows-2 gap-2 p-2 text-sm">
			<div className="grid grid-cols-[5rem_1fr] justify-center gap-2">
				<span>Experience:</span>
				<span className="text-center">{`Have ${experience} and need ${expLeft} to Level ${level + 1}`}</span>
			</div>
			<div className="grid grid-cols-[5rem_1fr] justify-center gap-2">
				<span>Percent:</span>
				<div className="relative flex h-6 flex-row items-center overflow-hidden rounded-lg bg-slate-500 text-xs">
					<div
						className="absolute h-full self-start bg-slate-600"
						style={{ width: `${expLeftPercent}%` }}
					/>
					<span className="relative z-10 w-full text-center">
						{`${experience} / ${experience + expLeft} (${expLeftPercent}%)`}
					</span>
				</div>
			</div>
		</div>
	);
};
