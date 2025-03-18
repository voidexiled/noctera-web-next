"use client";
import {
	AdminBattlepassContext,
	type AdminBattlepassContextType,
} from "@/app/(default)/account-manager/admin/battlepass/components/context/AdminBattlepassProvider";
import { getRewardPath } from "@/components/(battlepass)/battlepass/lib/utils";
import { FormProvider, RHFSelect, RHFTextField } from "@/components/common/hook-form";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	BATTLEPASS_RANK_ACCESS,
	BATTLEPASS_TYPE_REWARDS,
	type battlepass_seasons_rewards,
} from "@prisma/client";
import {
	CaretSortIcon,
	CheckIcon,
	ChevronDownIcon,
	ChevronUpIcon,
	CrossCircledIcon,
	Pencil1Icon,
} from "@radix-ui/react-icons";
import { SelectValue } from "@radix-ui/react-select";
import {
	type ColumnDef,
	type SortingState,
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import {
	ArrowUpDown,
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	Cross,
	CrossIcon,
	PencilIcon,
	RemoveFormatting,
	Trash,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { MoreHorizontal } from "lucide-react";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export const RewardsGrid = () => {
	const [filteredRewards, setFilteredRewards] = useState<battlepass_seasons_rewards[]>([]);

	const [openFilterSeason, setOpenFilterSeason] = useState(false);
	const [openFilterRankAccess, setOpenFilterRankAccess] = useState(false);
	const [openFilterRewardType, setOpenFilterRewardType] = useState(false);
	const [openFilterLevel, setOpenFilterLevel] = useState(false);

	const [selectedFilterSeason, setSelectedFilterSeason] = useState<string | null>(null);

	const [selectedFilterRankAccess, setSelectedFilterRankAccess] = useState<
		Array<BATTLEPASS_RANK_ACCESS>
	>([]);

	const [selectedFilterRewardType, setSelectedFilterRewardType] = useState<
		Array<BATTLEPASS_TYPE_REWARDS>
	>([]);

	const [selectedFilterLevel, setSelectedFilterLevel] = useState<Array<number>>([]);

	const { seasons, rewards } = useContext(AdminBattlepassContext) as AdminBattlepassContextType;

	const [sorting, setSorting] = useState<SortingState>([]);

	const columns: ColumnDef<battlepass_seasons_rewards>[] = [
		{
			accessorKey: "season_id",
			header: ({ column }) => {
				return (
					<Button
						size="xs"
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Season
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			},
			cell: ({ row }) => {
				const season_id = Number.parseInt(row.getValue("season_id"));
				const season = seasons.filter((s) => s.id === season_id);

				return <div className="text-left">{season[0].season_name}</div>;
			},
		},
		{
			accessorKey: "level",
			header: ({ column }) => {
				return (
					<Button
						size="xs"
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Level
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			},
		},
		{
			accessorKey: "reward_img",
			header: "Image",
			cell: ({ row }) => {
				const rw_type = (
					row.getValue("reward_type") as string
				).toUpperCase() as BATTLEPASS_TYPE_REWARDS;
				const rw_img = row.getValue("reward_img") as string;

				return (
					<div>
						<img src={getRewardPath(rw_type, rw_img)} alt="reward-img" />
					</div>
				);
			},
		},
		{
			accessorKey: "reward_name",
			header: "Name",
		},
		{
			accessorKey: "reward_type",
			header: ({ column }) => {
				return (
					<Button
						size="xs"
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Type
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			},
		},
		{
			accessorKey: "reward_amount",
			header: "Amount",
		},
		{
			accessorKey: "reward_value",
			header: "Value",
		},
		{
			accessorKey: "reward_should_plus",
			header: "Merge",
		},
		{
			accessorKey: "reward_required_access",
			header: ({ column }) => {
				return (
					<Button
						size="xs"
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Rank
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			},
		},
		{
			accessorKey: "visible",
			header: "Visible",
		},
		{
			id: "actions",
			cell: ({ row }) => {
				const reward = row.original as battlepass_seasons_rewards;
				return (
					<Dialog>
						<AlertDialog>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" size="xs">
										<span className="sr-only">Open menu</span>
										<MoreHorizontal className="h-4 w-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuLabel>Actions</DropdownMenuLabel>

									<DialogTrigger asChild>
										<DropdownMenuItem>
											Edit
											<DropdownMenuShortcut>
												<PencilIcon className="h-4 w-4" />
											</DropdownMenuShortcut>
										</DropdownMenuItem>
									</DialogTrigger>

									<AlertDialogTrigger asChild>
										<DropdownMenuItem>
											Delete
											<DropdownMenuShortcut>
												<Trash className="h-4 w-4" />
											</DropdownMenuShortcut>
										</DropdownMenuItem>
									</AlertDialogTrigger>
								</DropdownMenuContent>
							</DropdownMenu>
							<EditRewardForm reward={reward} />
							<DeleteRewardAlertDialog reward={reward} />
						</AlertDialog>
					</Dialog>
				);
			},
		},
	];

	const table = useReactTable({
		data: filteredRewards,
		columns: columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		state: {
			sorting,
		},
	});

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
				label += rangeStart === rangeEnd ? `${rangeStart}, ` : `${rangeStart}-${rangeEnd}, `;
				rangeStart = levels[i];
				rangeEnd = rangeStart;
			}
		}

		label += rangeStart === rangeEnd ? `${rangeStart}` : `${rangeStart}-${rangeEnd}`;

		return label;
	}

	function handleClearFilters() {
		setSelectedFilterSeason(null);
		setSelectedFilterLevel([]);
		setSelectedFilterRankAccess([]);
		setSelectedFilterRewardType([]);
	}

	function filterRewards() {
		if (!rewards || rewards.length === 0) return;
		const newRewards = rewards.filter((reward) => {
			return (
				(selectedFilterSeason === null ||
					Number.parseInt(selectedFilterSeason) === reward.season_id) &&
				(selectedFilterLevel.length === 0 || selectedFilterLevel.includes(reward.level)) &&
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
	}

	useEffect(() => {
		filterRewards();
	}, [
		selectedFilterSeason,
		selectedFilterLevel,
		selectedFilterRankAccess,
		selectedFilterRewardType,
	]);

	useEffect(() => {
		filterRewards();
	}, [rewards]);

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
								<Button variant="outline" className="w-full justify-between p-2" size="sm">
									{selectedFilterSeason
										? seasons.find((season) => season.id === Number.parseInt(selectedFilterSeason))
												?.season_name
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
																currentValue === selectedFilterSeason ? null : currentValue,
															);
															// setOpenFilterSeason(false);
														}}
													>
														<CheckIcon
															className={cn(
																"mr-2 h-4 w-4",
																Number.parseInt(selectedFilterSeason as string) === season.id
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
						<Popover open={openFilterRankAccess} onOpenChange={setOpenFilterRankAccess}>
							<PopoverTrigger asChild>
								<Button variant="outline" className="w-full justify-between p-2" size="sm">
									{selectedFilterRankAccess.length > 0
										? selectedFilterRankAccess.map((rankAccess, index) => {
												return rankAccess.concat(
													index !== selectedFilterRankAccess.length - 1 ? ", " : "",
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
											{Object.values(BATTLEPASS_RANK_ACCESS).map((rankAccess) => {
												return (
													<CommandItem
														key={rankAccess}
														value={rankAccess}
														onSelect={(currentValue) => {
															const convertedCurrentValue = currentValue as BATTLEPASS_RANK_ACCESS;
															const isSelected =
																selectedFilterRankAccess.includes(convertedCurrentValue);
															setSelectedFilterRankAccess(
																isSelected
																	? [
																			...selectedFilterRankAccess.filter(
																				(item) => item !== convertedCurrentValue,
																			),
																		]
																	: [...selectedFilterRankAccess, convertedCurrentValue],
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
											})}
										</CommandGroup>
									</CommandList>
								</Command>
							</PopoverContent>
						</Popover>
						{/* 
                     REWARD TYPE FILTER
                     */}
						<Popover open={openFilterRewardType} onOpenChange={setOpenFilterRewardType}>
							<PopoverTrigger asChild>
								<Button variant="outline" className="w-full justify-between p-2" size="sm">
									{selectedFilterRewardType.length > 0
										? selectedFilterRewardType.map((rewardType, index) => {
												return rewardType.concat(
													index !== selectedFilterRewardType.length - 1 ? ", " : "",
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
											{Object.values(BATTLEPASS_TYPE_REWARDS).map((rewardType) => {
												return (
													<CommandItem
														key={rewardType}
														value={rewardType}
														onSelect={(currentValue) => {
															const convertedCurrentValue = currentValue as BATTLEPASS_TYPE_REWARDS;
															const isSelected =
																selectedFilterRewardType.includes(convertedCurrentValue);
															setSelectedFilterRewardType(
																isSelected
																	? [
																			...selectedFilterRewardType.filter(
																				(item) => item !== convertedCurrentValue,
																			),
																		]
																	: [...selectedFilterRewardType, convertedCurrentValue],
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
											})}
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
								<Button variant="outline" className="w-full justify-between p-2" size="sm">
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
											{Array.from({ length: 50 }, (_, i) => i + 1).map((level) => {
												return (
													<CommandItem
														key={level}
														value={level.toString()}
														onSelect={(currentValue) => {
															const convertedCurrentValue = Number.parseInt(currentValue);
															const isSelected =
																selectedFilterLevel.includes(convertedCurrentValue);
															setSelectedFilterLevel(
																isSelected
																	? [
																			...selectedFilterLevel.filter(
																				(item) => item !== convertedCurrentValue,
																			),
																		]
																	: [...selectedFilterLevel, convertedCurrentValue],
															);
															// setOpenFilterLevel(false);
														}}
													>
														<CheckIcon
															className={cn(
																"mr-2 h-4 w-4",
																selectedFilterLevel.includes(level) ? "opacity-100" : "opacity-0",
															)}
														/>
														{level}
													</CommandItem>
												);
											})}
										</CommandGroup>
									</CommandList>
								</Command>
							</PopoverContent>
						</Popover>
					</div>
				</div>
				<div className="rounded-md border">
					<Table>
						<TableHeader>
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => {
										return (
											<TableHead key={header.id}>
												{header.isPlaceholder
													? null
													: flexRender(header.column.columnDef.header, header.getContext())}
											</TableHead>
										);
									})}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map((row) => {
									return (
										<TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
											{row.getVisibleCells().map((cell) => {
												return (
													<TableCell key={cell.id}>
														{flexRender(cell.column.columnDef.cell, cell.getContext())}
													</TableCell>
												);
											})}
										</TableRow>
									);
								})
							) : (
								<TableRow>
									<TableCell colSpan={columns.length} className="h-24 text-center">
										No results.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
				<div className="flex items-center justify-between px-2">
					<div className="flex-1 text-muted-foreground text-sm">
						{table.getFilteredSelectedRowModel().rows.length} of{" "}
						{table.getFilteredRowModel().rows.length} row(s) selected.
					</div>
					<div className="flex items-center space-x-6 lg:space-x-8">
						<div className="flex items-center space-x-2">
							<p className="font-medium text-sm">Rows per page</p>
							<Select
								value={`${table.getState().pagination.pageSize}`}
								onValueChange={(value) => {
									table.setPageSize(Number(value));
								}}
							>
								<SelectTrigger className="h-8 w-[70px]">
									<SelectValue placeholder={table.getState().pagination.pageSize} />
								</SelectTrigger>
								<SelectContent side="top">
									{[5, 10, 20, 30, 40, 50].map((pageSize) => (
										<SelectItem key={pageSize} value={`${pageSize}`}>
											{pageSize}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="flex w-[100px] items-center justify-center font-medium text-sm">
							Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
						</div>
						<div className="flex items-center space-x-2">
							<Button
								variant="outline"
								className="hidden h-8 w-8 p-0 lg:flex"
								onClick={() => table.setPageIndex(0)}
								disabled={!table.getCanPreviousPage()}
							>
								<span className="sr-only">Go to first page</span>
								<ChevronsLeft className="h-4 w-4" />
							</Button>
							<Button
								variant="outline"
								className="h-8 w-8 p-0"
								onClick={() => table.previousPage()}
								disabled={!table.getCanPreviousPage()}
							>
								<span className="sr-only">Go to previous page</span>
								<ChevronLeft className="h-4 w-4" />
							</Button>
							<Button
								variant="outline"
								className="h-8 w-8 p-0"
								onClick={() => table.nextPage()}
								disabled={!table.getCanNextPage()}
							>
								<span className="sr-only">Go to next page</span>
								<ChevronRight className="h-4 w-4" />
							</Button>
							<Button
								variant="outline"
								className="hidden h-8 w-8 p-0 lg:flex"
								onClick={() => table.setPageIndex(table.getPageCount() - 1)}
								disabled={!table.getCanNextPage()}
							>
								<span className="sr-only">Go to last page</span>
								<ChevronsRight className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>
			</div>
		</TooltipProvider>
	);
};

const EditRewardForm = ({ reward }: { reward: battlepass_seasons_rewards }) => {
	const [showImagePreview, setShowImagePreview] = useState(true);
	const [previewImageSrc, setPreviewImageSrc] = useState("");

	const { seasons, rewards, refetchSeasons } = useContext(
		AdminBattlepassContext,
	) as AdminBattlepassContextType;

	const formSchema = z.object({
		id: z.string(),
		season_id: z.string(),
		level: z.string(),
		reward_name: z.string(),
		reward_img: z.string(),
		reward_type: z.string(),
		reward_amount: z.string(),
		reward_value: z.string(),
		reward_should_plus_amount: z.boolean(),
		reward_required_access: z.string(),
		description: z.string(),
		visible: z.boolean(),
	});

	type EditRewardFormValues = z.infer<typeof formSchema>;

	const methods = useForm<EditRewardFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: reward.id.toString(),
			season_id: reward.season_id.toString(),
			level: reward.level.toString(),
			reward_name: reward.reward_name,
			reward_img: reward.reward_img,
			reward_type: reward.reward_type,
			reward_amount: reward.reward_amount.toString(),
			reward_value: reward.reward_value.toString(),
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
	const values = watch();

	async function onSubmit(data: EditRewardFormValues) {
		fetch("/api/battlepass/rewards/update", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				id: data.id,
				season_id: data.season_id,
				level: data.level,
				reward_name: data.reward_name,
				reward_img: data.reward_img,
				reward_type: data.reward_type,
				reward_amount: data.reward_amount,
				reward_value: data.reward_value,
				reward_should_plus_amount: data.reward_should_plus_amount,
				reward_required_access: data.reward_required_access,
				description: data.description,
				visible: data.visible,
			}),
		})
			.then(async (res) => {
				if (res.status === 200) {
					toast.success(`${data.reward_name} has been updated.`);
					refetchSeasons();
				}
			})
			.catch((e) => {
				const error: Error = e as Error;
				console.error(error);
				toast.error(error.message);
			});
	}

	useEffect(() => {
		setPreviewImageSrc(
			getRewardPath(
				watch("reward_type").toUpperCase() as BATTLEPASS_TYPE_REWARDS,
				watch("reward_img"),
			),
		);
	}, [values.reward_img, showImagePreview]);

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
						options={Object.values(BATTLEPASS_TYPE_REWARDS).map((rewardType) => {
							return {
								label: rewardType,
								value: rewardType,
							};
						})}
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

					<div className="flex items-center gap-2">
						<Checkbox
							id="show-image-preview"
							checked={showImagePreview}
							onCheckedChange={() => {
								setShowImagePreview(!showImagePreview);
							}}
							title="Show image preview"
						/>
						<Label htmlFor="show-image-preview">Show preview</Label>
					</div>

					{showImagePreview && methods.getValues("reward_img").length > 0 && (
						<img src={previewImageSrc} alt="reward-image" />
					)}

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

const DeleteRewardAlertDialog = ({ reward }: { reward: battlepass_seasons_rewards }) => {
	const { seasons, rewards } = useContext(AdminBattlepassContext) as AdminBattlepassContextType;

	const seasonName = seasons.find((season) => season.id === reward.season_id)?.season_name;

	return (
		<AlertDialogContent>
			<AlertDialogHeader>
				<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
				<AlertDialogDescription>
					You are about to delete the reward {reward.reward_name} (LVL {reward.level}, TYPE{" "}
					{reward.reward_type}, RANK {reward.reward_required_access}) from season {seasonName}. This
					action cannot be undone.
				</AlertDialogDescription>
			</AlertDialogHeader>
			<AlertDialogFooter>
				<AlertDialogCancel>Cancel</AlertDialogCancel>
				<AlertDialogAction>Continue</AlertDialogAction>
			</AlertDialogFooter>
		</AlertDialogContent>
	);
};
