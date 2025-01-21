import {
	AdminBattlepassContext,
	type AdminBattlepassContextType,
} from "@/app/account-manager/admin/battlepass/components/context/AdminBattlepassProvider";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { CalendarIcon } from "@radix-ui/react-icons";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { format } from "date-fns-tz";
import dayjs from "dayjs";
import { useContext } from "react";
import { date } from "zod";

export const SeasonsGrid = () => {
	const { toast } = useToast();
	const { seasons, refetchSeasons } = useContext(
		AdminBattlepassContext,
	) as AdminBattlepassContextType;

	const handleDeleteSeason = async (id: number) => {
		try {
			const res = await fetch("/api/battlepass/season/delete", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					id: id,
				}),
			});
			if (res.status === 200) {
				toast({
					title: "Delete Season",
					description: <div>Season with id {id} has been deleted.</div>,
				});
				refetchSeasons();
			}
		} catch (error) {
			const err = error as Error;
			console.log(err);
			toast({
				title: "Error:",
				variant: "destructive",
				description: <div>{err.message}</div>,
			});
		}
	};

	return (
		<TooltipProvider>
			<ScrollArea
				className="h-full w-full scroll-smooth border-b pb-2"
				scrollHideDelay={3000}
			>
				<ScrollBar orientation="horizontal" className="z-50" />
				<div className="flex flex-row gap-2 p-2">
					{seasons.map((season) => {
						const date_start = new Date(season.date_start);
						const date_end = new Date(season.date_end);
						const formated_start_date = format(date_start, "dd/MM/yyyy");
						const formated_end_date = format(date_end, "dd/MM/yyyy");
						return (
							<div
								key={season.id}
								className="relative grid h-[210px] w-[230px] grid-cols-1 grid-rows-[auto_1fr_auto] overflow-hidden border border-sm text-xs"
								style={{
									backgroundImage: `url('/battlepass/${season.background_img}')`,
									backgroundSize: "cover",
									backgroundPosition: "center",
									backgroundRepeat: "no-repeat",
								}}
							>
								<div className="header p-2">
									<h1 className="text-base">{season.season_name}</h1>
								</div>
								<div className="body p-2">
									<Tooltip>
										<TooltipTrigger asChild>
											<p className="line-clamp-3 text-card-foreground/80 text-sm">
												{season.description}
											</p>
										</TooltipTrigger>
										<TooltipContent>
											<p className="max-w-[150px] text-sm">
												{season.description}
											</p>
										</TooltipContent>
									</Tooltip>
								</div>
								<div className="footer flex flex-col gap-2 p-2 text-card-foreground/80">
									<span className="inline-flex">
										<span>
											<CalendarIcon className="mr-1 h-4 w-4" />
										</span>

										{formated_start_date
											.concat(" - ")
											.concat(formated_end_date)}
									</span>
									<div className="flex flex-row gap-2">
										<Button variant="outline" className="w-full" size="sm">
											Edit
										</Button>
										<Button variant="destructive" className="w-full" size="sm" onClick={async () => await handleDeleteSeason(season.id)}>
											Delete
										</Button>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</ScrollArea>
		</TooltipProvider>
	);
};
