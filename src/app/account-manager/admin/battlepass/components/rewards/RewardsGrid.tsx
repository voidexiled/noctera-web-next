"use client";
import { getRewardPath } from "@/app/(battlepass)/battlepass/lib/utils";
import {
	AdminBattlepassContext,
	type AdminBattlepassContextType,
} from "@/app/account-manager/admin/battlepass/components/context/AdminBattlepassProvider";
import { FormProvider, RHFSelect, RHFTextField } from "@/components/hook-form";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	BATTLEPASS_RANK_ACCESS,
	BATTLEPASS_TYPE_REWARDS,
	type battlepass_seasons_rewards,
} from "@prisma/client";
import {
	CheckIcon,
	ChevronDownIcon,
	ChevronUpIcon,
	CrossCircledIcon,
	Pencil1Icon,
} from "@radix-ui/react-icons";
import type { SelectValue } from "@radix-ui/react-select";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const RewardsGrid = () => {
	const [filteredRewards, setFilteredRewards] = useState<
		battlepass_seasons_rewards[]
	>([]);

	const [openFilterSeason, setOpenFilterSeason] = useState(false);
	const [openFilterRankAccess, setOpenFilterRankAccess] = useState(false);
	const [openFilterRewardType, setOpenFilterRewardType] = useState(false);
	const [openFilterLevel, setOpenFilterLevel] = useState(false);

	const [selectedFilterSeason, setSelectedFilterSeason] = useState<
		string | null
	>(null);

	const [selectedFilterRankAccess, setSelectedFilterRankAccess] = useState<
		Array<BATTLEPASS_RANK_ACCESS>
	>([]);

	const [selectedFilterRewardType, setSelectedFilterRewardType] = useState<
		Array<BATTLEPASS_TYPE_REWARDS>
	>([]);

	const [selectedFilterLevel, setSelectedFilterLevel] = useState<Array<number>>(
		[],
	);

	const { seasons, rewards } = useContext(
		AdminBattlepassContext,
	) as AdminBattlepassContextType;

	const tableHeaders = [
        "Img",
		"Id",
		"Season",
		"Name",
		"Type",
		"Amount",
		"Value",
		"Should Plus",
		"Rank",
		"Description",
		"Visible",
		"Actions",
	];

	function getLevelFilterLabel(levels: number[]): string {
		if (levels.length === 0) return "All";

		levels.sort((a, b) => a - b);

		let label = "";
		let rangeStart = levels[0];
		let rangeEnd = rangeStart;

		for (let i = 1; i < levels.length; i++) {
			if (levels[i] === rangeEnd + 1) {
				rangeEnd = levels[i];
			} else {
				label +=
					rangeStart === rangeEnd
						? `${rangeStart}, `
						: `${rangeStart}-${rangeEnd}, `;
				rangeStart = levels[i];
				rangeEnd = rangeStart;
			}
		}

		label +=
			rangeStart === rangeEnd ? `${rangeStart}` : `${rangeStart}-${rangeEnd}`;

		return label;
	}

	function handleClearFilters() {
		setSelectedFilterSeason(null);
		setSelectedFilterLevel([]);
		setSelectedFilterRankAccess([]);
		setSelectedFilterRewardType([]);
	}

	function handleEditReward(reward: battlepass_seasons_rewards) {
		console.log(reward);
	}
	function handleDeleteReward(reward: battlepass_seasons_rewards) {
		console.log(reward);
	}

	useEffect(() => {
		const newRewards = rewards.filter((reward) => {
			return (
				(selectedFilterSeason === null ||
					Number.parseInt(selectedFilterSeason) === reward.season_id) &&
				(selectedFilterLevel.length === 0 ||
					selectedFilterLevel.includes(reward.level)) &&
				(selectedFilterRankAccess.length === 0 ||
					selectedFilterRankAccess.includes(
						reward.reward_required_access.toLowerCase() as BATTLEPASS_RANK_ACCESS,
					)) &&
				(selectedFilterRewardType.length === 0 ||
					selectedFilterRewardType.includes(
						reward.reward_type.toLowerCase() as BATTLEPASS_TYPE_REWARDS,
					))
			);
		});
		setFilteredRewards(newRewards);
	}, [
		selectedFilterSeason,
		selectedFilterLevel,
		selectedFilterRankAccess,
		selectedFilterRewardType,
	]);

	return (
		<TooltipProvider>
			<div className="grid grid-rows-[auto_1fr] gap-2 p-2">
				<div className="grid grid-rows-2 gap-2">
					<div className="grid grid-cols-[1fr_auto] gap-2">
						{/* 
                     SEASON FILTER
                     */}
						<Popover open={openFilterSeason} onOpenChange={setOpenFilterSeason}>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									className="w-full justify-between p-2"
									size="sm"
								>
									{selectedFilterSeason
										? seasons.find(
												(season) =>
													season.id === Number.parseInt(selectedFilterSeason),
											)?.season_name
										: "Filter by season"}
									<ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-[260px] p-0">
								<Command>
									<CommandInput placeholder="Search season..." />
									<CommandList>
										<CommandEmpty>No seasons found.</CommandEmpty>
										<CommandGroup>
											{seasons.map((season) => {
												return (
													<CommandItem
														key={season.id}
														value={season.id.toString()}
														onSelect={(currentValue) => {
															setSelectedFilterSeason(
																currentValue === selectedFilterSeason
																	? null
																	: currentValue,
															);
															// setOpenFilterSeason(false);
														}}
													>
														<CheckIcon
															className={cn(
																"mr-2 h-4 w-4",
																Number.parseInt(
																	selectedFilterSeason as string,
																) === season.id
																	? "opacity-100"
																	: "opacity-0",
															)}
														/>
														{season.season_name}
													</CommandItem>
												);
											})}
										</CommandGroup>
									</CommandList>
								</Command>
							</PopoverContent>
						</Popover>
						<Button
							variant="destructive"
							className="w-full justify-between p-2"
							size="sm"
							onClick={handleClearFilters}
						>
							Clear filters
							<CrossCircledIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
						</Button>
					</div>
					<div className="grid grid-cols-3 gap-2">
						{/* 
                     RANK ACCESS FILTER
                     */}
						<Popover
							open={openFilterRankAccess}
							onOpenChange={setOpenFilterRankAccess}
						>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									className="w-full justify-between p-2"
									size="sm"
								>
									{selectedFilterRankAccess.length > 0
										? selectedFilterRankAccess.map((rankAccess, index) => {
												return rankAccess.concat(
													index !== selectedFilterRankAccess.length - 1
														? ", "
														: "",
												);
											})
										: "Filter by rank"}
									<ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-[260px] p-0">
								<Command>
									<CommandInput placeholder="Search rank..." />
									<CommandList>
										<CommandEmpty>No ranks found.</CommandEmpty>
										<CommandGroup>
											{Object.values(BATTLEPASS_RANK_ACCESS).map(
												(rankAccess) => {
													return (
														<CommandItem
															key={rankAccess}
															value={rankAccess}
															onSelect={(currentValue) => {
																const convertedCurrentValue =
																	currentValue as BATTLEPASS_RANK_ACCESS;
																const isSelected =
																	selectedFilterRankAccess.includes(
																		convertedCurrentValue,
																	);
																setSelectedFilterRankAccess(
																	isSelected
																		? [
																				...selectedFilterRankAccess.filter(
																					(item) =>
																						item !== convertedCurrentValue,
																				),
																			]
																		: [
																				...selectedFilterRankAccess,
																				convertedCurrentValue,
																			],
																);
																// setOpenFilterRankAccess(false);
															}}
														>
															<CheckIcon
																className={cn(
																	"mr-2 h-4 w-4",
																	selectedFilterRankAccess.includes(
																		rankAccess.toLowerCase() as BATTLEPASS_RANK_ACCESS,
																	)
																		? "opacity-100"
																		: "opacity-0",
																)}
															/>
															{rankAccess}
														</CommandItem>
													);
												},
											)}
										</CommandGroup>
									</CommandList>
								</Command>
							</PopoverContent>
						</Popover>
						{/* 
                     REWARD TYPE FILTER
                     */}
						<Popover
							open={openFilterRewardType}
							onOpenChange={setOpenFilterRewardType}
						>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									className="w-full justify-between p-2"
									size="sm"
								>
									{selectedFilterRewardType.length > 0
										? selectedFilterRewardType.map((rewardType, index) => {
												return rewardType.concat(
													index !== selectedFilterRewardType.length - 1
														? ", "
														: "",
												);
											})
										: "Filter by reward type"}
									<ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-[260px] p-0">
								<Command>
									<CommandInput placeholder="Search rank..." />
									<CommandList>
										<CommandEmpty>No reward types found.</CommandEmpty>
										<CommandGroup>
											{Object.values(BATTLEPASS_TYPE_REWARDS).map(
												(rewardType) => {
													return (
														<CommandItem
															key={rewardType}
															value={rewardType}
															onSelect={(currentValue) => {
																const convertedCurrentValue =
																	currentValue as BATTLEPASS_TYPE_REWARDS;
																const isSelected =
																	selectedFilterRewardType.includes(
																		convertedCurrentValue,
																	);
																setSelectedFilterRewardType(
																	isSelected
																		? [
																				...selectedFilterRewardType.filter(
																					(item) =>
																						item !== convertedCurrentValue,
																				),
																			]
																		: [
																				...selectedFilterRewardType,
																				convertedCurrentValue,
																			],
																);
																// setOpenFilterRewardType(false);
															}}
														>
															<CheckIcon
																className={cn(
																	"mr-2 h-4 w-4",
																	selectedFilterRewardType.includes(
																		rewardType.toLowerCase() as BATTLEPASS_TYPE_REWARDS,
																	)
																		? "opacity-100"
																		: "opacity-0",
																)}
															/>
															{rewardType}
														</CommandItem>
													);
												},
											)}
										</CommandGroup>
									</CommandList>
								</Command>
							</PopoverContent>
						</Popover>
						{/* 
                     LEVEL FILTER
                     */}
						<Popover open={openFilterLevel} onOpenChange={setOpenFilterLevel}>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									className="w-full justify-between p-2"
									size="sm"
								>
									{selectedFilterLevel.length > 0
										? getLevelFilterLabel(selectedFilterLevel)
										: "Filter by level"}
									<ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-[260px] p-0">
								<Command>
									<CommandInput placeholder="Search level..." />
									<CommandList>
										<CommandEmpty>No levels found.</CommandEmpty>
										<CommandGroup>
											{Array.from({ length: 50 }, (_, i) => i + 1).map(
												(level) => {
													return (
														<CommandItem
															key={level}
															value={level.toString()}
															onSelect={(currentValue) => {
																const convertedCurrentValue =
																	Number.parseInt(currentValue);
																const isSelected = selectedFilterLevel.includes(
																	convertedCurrentValue,
																);
																setSelectedFilterLevel(
																	isSelected
																		? [
																				...selectedFilterLevel.filter(
																					(item) =>
																						item !== convertedCurrentValue,
																				),
																			]
																		: [
																				...selectedFilterLevel,
																				convertedCurrentValue,
																			],
																);
																// setOpenFilterLevel(false);
															}}
														>
															<CheckIcon
																className={cn(
																	"mr-2 h-4 w-4",
																	selectedFilterLevel.includes(level)
																		? "opacity-100"
																		: "opacity-0",
																)}
															/>
															{level}
														</CommandItem>
													);
												},
											)}
										</CommandGroup>
									</CommandList>
								</Command>
							</PopoverContent>
						</Popover>
					</div>
				</div>
				<Table>
					<TableHeader>
						<TableRow>
							{tableHeaders.map((header, index) => {
								return <TableCell key={header}>{header}</TableCell>;
							})}
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredRewards.map((reward) => {
							return (
								
									
										<TableRow key={reward.id}>
                                            <TableCell><img src={getRewardPath(reward.reward_type, reward.reward_img)} alt="reward-image" /></TableCell>
											<TableCell>{reward.id}</TableCell>
											<TableCell >
												{
													seasons.find(
														(season) => season.id === reward.season_id,
													)?.season_name
												}
											</TableCell>
											<TableCell >{reward.reward_name}</TableCell>
											<TableCell>{reward.reward_type}</TableCell>
											<TableCell>{reward.reward_amount}</TableCell>
											<TableCell>{reward.reward_value}</TableCell>
											<TableCell>
												{reward.reward_should_plus_amount ? "Yes" : "No"}
											</TableCell>
											<TableCell>{reward.reward_required_access}</TableCell>
											<TableCell className="line-clamp-2">{reward.description}</TableCell>
											<TableCell>{reward.visible ? "Yes" : "No"}</TableCell>
											<TableCell>
												<div className="flex h-full w-full flex-row items-center gap-2">
													<Dialog>
														<DialogTrigger asChild>
															<Button
																variant="blue"
																size="iconsm"
															>
																<Pencil1Icon className="h-4 w-4" />
															</Button>
														</DialogTrigger>
														<DialogContent>
															<EditRewardForm reward={reward} />
														</DialogContent>
													</Dialog>
													<AlertDialog>
														<AlertDialogTrigger asChild>
															<Button
																variant="destructive"
																size="iconsm"
															>
																<CrossCircledIcon className="h-4 w-4" />
															</Button>
														</AlertDialogTrigger>
                                                        <DeleteRewardAlertDialog reward={reward} />
													</AlertDialog>
												</div>
											</TableCell>
										</TableRow>
									
							);
						})}
					</TableBody>
				</Table>
			</div>
		</TooltipProvider>
	);
};

const EditRewardForm = ({ reward }: { reward: battlepass_seasons_rewards }) => {
	const { toast } = useToast();
	const { seasons, rewards } = useContext(
		AdminBattlepassContext,
	) as AdminBattlepassContextType;

	const formSchema = z.object({
		id: z.number(),
		season_id: z.string(),
		level: z.number(),
		reward_name: z.string(),
		reward_img: z.string(),
		reward_type: z.string(),
		reward_amount: z.number(),
		reward_value: z.number(),
		reward_should_plus_amount: z.boolean(),
		reward_required_access: z.string(),
		description: z.string(),
		visible: z.boolean(),
	});

	type EditRewardFormValues = z.infer<typeof formSchema>;

	const methods = useForm<EditRewardFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: reward.id,
			season_id: reward.season_id.toString(),
			level: reward.level,
			reward_name: reward.reward_name,
			reward_img: reward.reward_img,
			reward_type: reward.reward_type,
			reward_amount: reward.reward_amount,
			reward_value: reward.reward_value,
			reward_should_plus_amount: reward.reward_should_plus_amount,
			reward_required_access: reward.reward_required_access,
			description: reward.description,
			visible: reward.visible,
		},
	});

	const {
		handleSubmit,
		watch,
		formState: { isSubmitting },
		trigger,
	} = methods;

	async function onSubmit(data: EditRewardFormValues) {
		console.log("data: ", data);
	}

	return (
		<DialogContent>
			<div className="flex flex-col gap-4 p-2">
				<h1>Edit Reward</h1>
				<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
					<RHFSelect
						name="season_id"
						label="Season"
						LabelOption="label"
						keyValue="value"
						defaultValue={reward.season_id.toString()}
						options={seasons.map((season) => {
							return {
								label: season.season_name,
								value: season.id.toString(),
							};
						})}
						disabled={isSubmitting}
						onValueChange={() => {
							trigger("season_id");
						}}
					/>

					<RHFSelect
						name="reward_type"
						label="Reward Type"
						LabelOption="label"
						keyValue="value"
						defaultValue={reward.reward_type}
						options={Object.values(BATTLEPASS_TYPE_REWARDS).map(
							(rewardType) => {
								return {
									label: rewardType,
									value: rewardType,
								};
							},
						)}
						disabled={isSubmitting}
						onValueChange={() => {
							trigger("reward_type");
						}}
					/>

					<RHFTextField
						name="reward_name"
						label="Reward Name"
						disabled={isSubmitting}
						onChange={() => {
							trigger("reward_name");
						}}
					/>

					<RHFTextField
						name="description"
						label="Description"
						disabled={isSubmitting}
						onChange={() => {
							trigger("description");
						}}
					/>

					<RHFTextField
						name="reward_img"
						label="Reward Image Name"
						disabled={isSubmitting}
						onChange={() => {
							trigger("reward_img");
						}}
					/>

					<div className="grid grid-cols-2 gap-4">
						<RHFTextField
							name="reward_amount"
							label="Reward Amount"
							disabled={isSubmitting}
							onChange={() => {
								trigger("reward_amount");
							}}
						/>

						<RHFTextField
							name="reward_value"
							label="Reward Value"
							disabled={isSubmitting}
							onChange={() => {
								trigger("reward_value");
							}}
						/>
					</div>

					<RHFSelect
						name="reward_required_access"
						label="Reward Required Access"
						LabelOption="label"
						keyValue="value"
						defaultValue={reward.reward_required_access}
						options={Object.values(BATTLEPASS_RANK_ACCESS).map((rankAccess) => {
							return {
								label: rankAccess,
								value: rankAccess,
							};
						})}
						onValueChange={() => {
							trigger("reward_required_access");
						}}
						disabled={isSubmitting}
					/>
					{/* Buttons */}
					<div className="grid grid-cols-3 gap-4">
						<Button
							variant="ghost"
							size="sm"
							type="button"
							onClick={() => {
								methods.reset();
							}}
						>
							Restore defaults
						</Button>
						<DialogClose asChild>
							<Button variant="destructive" size="sm" type="button">
								Close
							</Button>
						</DialogClose>
						<Button variant="default" size="sm" type="submit">
							Save
						</Button>
					</div>
				</FormProvider>
			</div>
		</DialogContent>
	);
};

const DeleteRewardAlertDialog = ({
	reward,
}: { reward: battlepass_seasons_rewards }) => {
	const { seasons, rewards } = useContext(
		AdminBattlepassContext,
	) as AdminBattlepassContextType;
	const { toast } = useToast();

	const seasonName = seasons.find(
		(season) => season.id === reward.season_id,
	)?.season_name;

	return (
		<AlertDialogContent>
			<AlertDialogHeader>
				<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
				<AlertDialogDescription>
					You are about to delete the reward {reward.reward_name} (LVL{" "}
					{reward.level}, TYPE {reward.reward_type}, RANK{" "}
					{reward.reward_required_access}) from season {seasonName}. This action
					cannot be undone.
				</AlertDialogDescription>
			</AlertDialogHeader>
			<AlertDialogFooter>
				<AlertDialogCancel>Cancel</AlertDialogCancel>
				<AlertDialogAction>Continue</AlertDialogAction>
			</AlertDialogFooter>
		</AlertDialogContent>
	);
};
