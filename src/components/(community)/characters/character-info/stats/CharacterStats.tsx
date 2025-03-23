import { InventoryDisplay } from "@/components/(community)/characters/character-info/character-inventory/InventoryDisplay";
import { CharacterStatsLayout } from "@/components/(community)/characters/character-info/stats/CharacterStatsLayout";
import { ExperienceDisplay } from "@/components/(community)/characters/character-info/stats/ExperienceDisplay";
import { SkillItem } from "@/components/(community)/characters/character-info/stats/SkillItem";
import { StatBar } from "@/components/(community)/characters/character-info/stats/StatBar";
import type { PlayerWithItems } from "@/components/(community)/characters/types/character";
import OutfitComponent from "@/components/animations/OutfitComponent";
import type { players } from "@prisma/client";

interface CharacterStatsProps {
	player: PlayerWithItems;
}

export const CharacterStats = ({ player }: CharacterStatsProps) => {
	const skills = [
		{ src: "/animated-items/28887.gif", alt: "level", name: "Level", value: player.level },
		{ src: "/animated-items/35289.gif", alt: "magic", name: "Magic", value: player.maglevel },
		{ src: "/animated-items/17828.gif", alt: "fist", name: "Fist", value: player.skill_fist },
		{ src: "/animated-items/35285.gif", alt: "sword", name: "Sword", value: player.skill_sword },
		{ src: "/animated-items/35286.gif", alt: "axe", name: "Axe", value: player.skill_axe },
		{ src: "/animated-items/35287.gif", alt: "club", name: "Club", value: player.skill_club },
		{ src: "/animated-items/35288.gif", alt: "dist", name: "Dist", value: player.skill_dist },
		{ src: "/animated-items/44067.gif", alt: "def", name: "Def", value: player.skill_shielding },
		{ src: "/animated-items/3483.gif", alt: "fish", name: "Fish", value: player.skill_fishing },
	];

	return (
		<CharacterStatsLayout
			outfit={
				<div className="grid grid-cols-[1fr] gap-2 p-2">
					<div className="m-auto grid">
						<OutfitComponent
							outfit={{
								looktype: player.looktype,
								lookaddons: player.lookaddons,
								lookhead: player.lookhead,
								lookbody: player.lookbody,
								looklegs: player.looklegs,
								lookfeet: player.lookfeet,
							}}
							className="-left-5 -top-5 h-[84px] w-[84px]"
						/>
					</div>
				</div>
			}
			inventory={<InventoryDisplay player={player} />}
			stats={
				<div className="grid grid-rows-2 gap-2 p-2 text-sm">
					<StatBar
						current={player.health}
						max={player.healthmax}
						colorClass="bg-red-500"
						label="Health"
					/>
					<StatBar
						current={player.mana}
						max={player.manamax}
						colorClass="bg-blue-500"
						label="Mana"
					/>
				</div>
			}
			experience={<ExperienceDisplay experience={player.experience} level={player.level} />}
			skills={
				<div className="grid grid-cols-9 grid-rows-1 items-center justify-center gap-2 p-2 text-center text-sm">
					{skills.map((skill, index) => (
						<SkillItem
							key={skill.name}
							imageSrc={skill.src}
							altText={`${skill.name}-skill-image`}
							skillName={skill.name}
							value={skill.value}
						/>
					))}
				</div>
			}
		/>
	);
};
