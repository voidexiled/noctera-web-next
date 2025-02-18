// ! TODO: Delete this file
import CategoryFilter from "@/components/(community)/highscores/filters/CategoryFilter";
import VocationFilter from "@/components/(community)/highscores/filters/VocationFilter";
import { Label } from "@/components/ui/label";

export const HighscoresFilters = () => {
	return (
		<div className="grid gap-2 rounded-sm border p-2 sm:grid-cols-2">
			<div>
				<Label htmlFor="voc" className="ml-1">
					Vocation
				</Label>
				<VocationFilter
					options={[
						{ value: "2", label: "Druid" },
						{ value: "4", label: "Knight" },
						{ value: "3", label: "Paladin" },
						{ value: "1", label: "Sorcerer" },
					]}
				/>
			</div>
			<div>
				<Label htmlFor="voc" className="ml-1">
					Category
				</Label>
				<CategoryFilter
					options={[
						{ value: "skill_axe", label: "Axe Fighting" },
						{ value: "skill_club", label: "Club Fighting" },
						{ value: "skill_dist", label: "Distance Fighting" },
						{ value: "experience", label: "Exp" },
						{ value: "skill_fishing", label: "Fishing" },
						{ value: "skill_fist", label: "First Fighting" },
						{ value: "maglevel", label: "Magic Level" },
						{ value: "skill_shielding", label: "Shielding" },
						{ value: "skill_sword", label: "Sword Fighting" },
					]}
				/>
			</div>
		</div>
	);
};
