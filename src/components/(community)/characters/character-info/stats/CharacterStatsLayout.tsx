type CharacterStatsLayoutProps = {
	outfit: React.ReactNode;
	inventory: React.ReactNode;
	stats: React.ReactNode;
	experience: React.ReactNode;
	skills: React.ReactNode;
};

export const CharacterStatsLayout = ({
	outfit,
	inventory,
	stats,
	experience,
	skills,
}: CharacterStatsLayoutProps) => (
	<div className="grid grid-cols-1 grid-rows-2 items-center gap-2 rounded-sm p-2 lg:grid-cols-[160px_1fr] lg:grid-rows-1">
		{/* Left Column */}
		<div className="grid grid-rows-[auto_1fr] gap-2">
			{outfit}
			{inventory}
		</div>

		{/* Right Column */}
		<div className="grid grid-rows-3 gap-2">
			{stats}
			{experience}
			{skills}
		</div>
	</div>
);
