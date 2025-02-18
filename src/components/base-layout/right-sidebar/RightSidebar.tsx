import BoostedComponent from "@/components/animations/BoostedComponent";
import { TransparentContainer } from "@/components/base-layout/common/TransparentContainer";
import { BoostedCard } from "@/components/base-layout/right-sidebar/BoostedCard";
import CountDown from "@/components/base-layout/right-sidebar/CountDown";
import RashidBox from "@/components/base-layout/right-sidebar/RashidBox";
import { HighscoresCard } from "@/components/base-layout/right-sidebar/highscores-card/HighscoresCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CountdownProps } from "@/lib/lib";
import type { ConfigLua } from "@/utils/readConfigLua";
import type { boosted_boss, boosted_creature, players } from "@prisma/client";

type RightSidebarProps = {
	boostedCreature: boosted_creature | null;
	boostedBoss: boosted_boss | null;
	highscorePlayers: players[];
	serverSaveTime: CountdownProps;
	nowDate: Date;
};

export const RightSidebar = ({
	nowDate,
	serverSaveTime,
	boostedCreature,
	boostedBoss,
	highscorePlayers,
}: RightSidebarProps) => {
	return (
		<aside className="col-span-1 gap-2 space-y-2 sm:col-span-2 ">
			<TransparentContainer>
				{/* <Card>
					<CardHeader className="border-b">
						<CardTitle className="grid grid-cols-2 text-center">
							<div>Creature</div>
							<div>Boss</div>
						</CardTitle>
					</CardHeader>
					<CardContent className="grid grid-cols-2 grid-rows-1 justify-between py-5 md:py-0">
						{boostedCreature && (
							<BoostedComponent
								boosted={{
									boostname: boostedCreature.boostname,
									lookaddons: 0,
									lookbody: 0,
									lookfeet: 0,
									lookhead: 0,
									looklegs: 0,
									lookmount: 0,
									looktype: boostedCreature.looktype,
								}}
								kind="creature"
							/>
						)}
						{boostedBoss && (
							<BoostedComponent
								boosted={{
									boostname: boostedBoss.boostname,
									lookaddons: 0,
									lookbody: 0,
									lookfeet: 0,
									lookhead: 0,
									looklegs: 0,
									lookmount: 0,
									looktype: boostedBoss.looktype,
								}}
								kind="boss"
							/>
						)}
					</CardContent>
				</Card> */}
				{boostedCreature && (
					<BoostedCard
						boosted={{
							boostname: boostedCreature.boostname,
							lookaddons: 0,
							lookbody: 0,
							lookfeet: 0,
							lookhead: 0,
							looklegs: 0,
							lookmount: 0,
							looktype: boostedCreature.looktype,
							looktypeEx: null,
						}}
						kind="creature"
					/>
				)}
				{boostedBoss && (
					<BoostedCard
						boosted={{
							boostname: boostedBoss.boostname,
							lookaddons: 0,
							lookbody: 0,
							lookfeet: 0,
							lookhead: 0,
							looklegs: 0,
							lookmount: 0,
							looktype: boostedBoss.looktype,
							looktypeEx: boostedBoss.looktypeEx,
						}}
						kind="boss"
					/>
				)}
			</TransparentContainer>
			<TransparentContainer>
				<HighscoresCard players={highscorePlayers} />
			</TransparentContainer>
			{/* Top 1 */}
			{/* Top Guild */}
			<TransparentContainer>
				<CountDown
					hour={serverSaveTime.hour}
					min={serverSaveTime.min}
					sec={serverSaveTime.sec}
					nowDate={nowDate}
				/>
			</TransparentContainer>
			{/* <TransparentContainer>
				<RashidBox />
			</TransparentContainer> */}
		</aside>
	);
};
