import {
	AdminBattlepassContext,
	type AdminBattlepassContextType,
} from "@/app/account-manager/admin/battlepass/components/context/AdminBattlepassProvider";
import { FormProvider, RHFSelect, RHFTextField } from "@/components/hook-form";
import RHFDatePicker from "@/components/hook-form/RHFDatePicker";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import type { battlepass_seasons } from "@prisma/client";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { CalendarIcon } from "@radix-ui/react-icons";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { format } from "date-fns-tz";
import dayjs from "dayjs";
import { useContext, useEffect, useState } from "react";
import { TZDate } from "react-day-picker";
import { useForm } from "react-hook-form";
import { date, z } from "zod";

export const SeasonsGrid = () => {
	const [openEditDialog, setOpenEditDialog] = useState(false);
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
			err;
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
					{seasons?.map((season) => {
						const date_start = new Date(season.date_start);
						const date_end = new Date(season.date_end);
						const formated_start_date = format(date_start, "dd/MM/yyyy");
						const formated_end_date = format(date_end, "dd/MM/yyyy");
						return (
							<div
								key={season.id}
								className="relative grid h-[210px] w-[230px] grid-cols-1 grid-rows-[60px_1fr_auto] overflow-hidden border border-sm text-xs"
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
											<p className="line-clamp-2 text-card-foreground/80 text-sm">
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
								<div className="footer flex flex-col gap-2 text-card-foreground/80">
									<span className="inline-flex px-2">
										<span>
											<CalendarIcon className="mr-1 h-4 w-4" />
										</span>

										{formated_start_date
											.concat(" - ")
											.concat(formated_end_date)}
									</span>
									<div className="flex flex-row gap-2 bg-background/60 p-2">
										<Dialog>
											<DialogTrigger asChild>
												<Button variant="blue" className="w-full" size="sm">
													Edit
												</Button>
											</DialogTrigger>
											<EditSeasonForm season={season} />
										</Dialog>
										<Button
											variant="destructive"
											className="w-full"
											size="sm"
											onClick={async () => await handleDeleteSeason(season.id)}
										>
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

const EditSeasonForm = ({
	season,
}: {
	season: battlepass_seasons;
}) => {
	const [showImagePreview, setShowImagePreview] = useState(true);
	const [previewImageSrc, setPreviewImageSrc] = useState("");

	const { toast } = useToast();
	const { seasons, refetchSeasons } = useContext(
		AdminBattlepassContext,
	) as AdminBattlepassContextType;

	const formSchema = z.object({
		id: z.string(),
		season_number: z.string(),
		season_name: z.string(),
		date_start: z.date(),
		date_end: z.date(),
		background_img: z.string(),
		description: z.string(),
	});

	type EditSeasonFormValues = z.infer<typeof formSchema>;

	const methods = useForm<EditSeasonFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: season.id.toString(),
			season_number: season.season_number.toString(),
			season_name: season.season_name,
			date_start: season.date_start,
			date_end: season.date_end,
			background_img: season.background_img,
			description: season.description,
		},
	});

	const {
		handleSubmit,
		watch,
		formState: { isSubmitting },
		trigger,
	} = methods;
	const values = watch();

	async function onSubmit(data: EditSeasonFormValues) {
		fetch("/api/battlepass/season/update", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				id: data.id,
				season_name: data.season_name,
				season_number: data.season_number,
				date_start: data.date_start,
				date_end: data.date_end,
				background_img: data.background_img,
				description: data.description,
			}),
		})
			.then(async (res) => {
				if (res.status === 200) {
					toast({
						title: "Update Season",
						description: <div>{data.season_name} has been updated.</div>,
					});
					refetchSeasons();
					//setOpen(false);
				}
			})
			.catch((error) => {
				error;
				toast({
					title: "Error:",
					variant: "destructive",
					description: <div>{error}</div>,
				});
			});
	}

	useEffect(() => {
		setPreviewImageSrc(`/battlepass/${watch("background_img")}`);
	}, [values.background_img, showImagePreview]);

	return (
		<DialogContent>
			<div className="flex flex-col gap-4 p-2">
				<h1>Edit Season</h1>
				<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
					<div className="grid grid-cols-[1fr_100px] gap-4">
						<RHFTextField
							name="season_name"
							label="Title"
							disabled={isSubmitting}
							onChange={() => trigger("season_name")}
						/>
						<RHFTextField
							name="season_number"
							label="Number"
							disabled={isSubmitting}
							onChange={() => trigger("season_number")}
						/>
					</div>
					<RHFTextField
						name="description"
						label="Description"
						disabled={isSubmitting}
						onChange={() => {
							trigger("description");
						}}
					/>
					<div className="grid grid-cols-2 gap-4">
						<RHFDatePicker
							name="date_start"
							label="Start Date"
							disabled={isSubmitting}
							onChange={() => trigger("date_start")}
						/>
						<RHFDatePicker
							name="date_end"
							label="End Date"
							disabled={isSubmitting}
							onChange={() => trigger("date_end")}
						/>
					</div>
					<RHFTextField
						name="background_img"
						label="Background Image Name"
						disabled={isSubmitting}
						onChange={() => {
							trigger("background_img");
						}}
					/>
					<div className="flex items-center gap-2">
						<Checkbox
							checked={showImagePreview}
							onCheckedChange={() => {
								setShowImagePreview(!showImagePreview);
							}}
							title="Show background image preview"
						/>
						<Label>Preview image</Label>
					</div>
					{showImagePreview &&
						methods.getValues("background_img").length > 0 && (
							<img src={previewImageSrc} alt="season-image" />
						)}

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
