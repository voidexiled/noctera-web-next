type SkillItemProps = {
	imageSrc: string;
	altText: string;
	skillName: string;
	value: number;
};

export const SkillItem = ({ imageSrc, altText, skillName, value }: SkillItemProps) => (
	<div className="grid w-12 grid-rows-[1fr_1rem_1rem] items-center justify-center gap-1">
		<img src={imageSrc} alt={altText} className="mx-auto" />
		<span>{skillName}</span>
		<span className="text-xs">{value}</span>
	</div>
);
