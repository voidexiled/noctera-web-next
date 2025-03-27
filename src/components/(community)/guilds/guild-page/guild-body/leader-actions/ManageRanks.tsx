"use client";

import { API_ROUTES } from "@/app/api/routes";
import type {
	GuildsManagerIdRanksDELETERequest,
	GuildsManagerIdRanksDELETEResponse,
	GuildsManagerIdRanksGETRequest,
	GuildsManagerIdRanksGETResponse,
	GuildsManagerIdRanksPUTRequest,
	GuildsManagerIdRanksPUTResponse,
} from "@/app/api/types";
import CreateNewRankForm from "@/components/(community)/guilds/guild-page/guild-body/leader-actions/CreateNewRankForm";
import { IconiFy } from "@/components/common/Iconify";
import { FormProvider, RHFSelect, RHFTextField } from "@/components/common/hook-form";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { typedFetch } from "@/utils/typedFetch";
import { zodResolver } from "@hookform/resolvers/zod";
import type { guild_membership, guild_ranks, guilds } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const FormSchema = z.object({
	guild_id: z.number(),
	ranks: z.array(z.object({ id: z.number(), guild_id: z.number(), name: z.string(), level: z.number() })),
});

type ItemFormValues = z.infer<typeof FormSchema>;

type ManageRanksProps = {
	guild: guilds & {
		guild_membership: guild_membership[];
		guild_ranks: guild_ranks[];
	};
};

export const ManageRanks = ({ guild }: ManageRanksProps) => {
	const router = useRouter();
	const defaultValues: ItemFormValues = {
		guild_id: guild.id,
		ranks: guild.guild_ranks,
	};

	const methods = useForm<ItemFormValues>({
		resolver: zodResolver(FormSchema),
		defaultValues,
	});
	const {
		setValue,
		handleSubmit,
		watch,
		formState: { isSubmitting, isDirty },
	} = methods;

	async function onSubmit(formData: ItemFormValues) {
		try {
			const res = await typedFetch<GuildsManagerIdRanksPUTRequest, GuildsManagerIdRanksPUTResponse>(API_ROUTES.guilds.manager.id(guild.id).ranks._, {
				method: "PUT",
				body: formData,
			});

			if (res.status === 200) {
				toast.success("Guild has been updated.");
			}

			router.refresh();
			document.getElementById("closeDialog")?.click();
		} catch (e) {
			const error: Error = e as Error;
			console.error(error);
		}
	}

	async function onDelete(id: number) {
		try {
			const res = await typedFetch<GuildsManagerIdRanksDELETERequest, GuildsManagerIdRanksDELETEResponse>(
				API_ROUTES.guilds.manager.id(guild.id).ranks._,
				{
					method: "DELETE",
					body: {
						rank_id: id,
					},
				},
			);
			// console.log(res);
			if (res.status === 200) {
				const deletedRankName = watch("ranks").find((rank) => rank.id === id)?.name;
				toast.success(`Rank ${deletedRankName} has been deleted`);
				router.refresh();
				return;
			}
			if (res.status === 400) {
				toast.error("An error ocurred while deleting rank");
				router.refresh();
				return;
			}

			toast.error("An internal error ocurred while deleting rank");
			router.refresh();
		} catch (e) {
			const error: Error = e as Error;
			console.error(error);
		}
	}

	const reloadRanks = async () => {
		const res = await typedFetch<GuildsManagerIdRanksGETRequest, GuildsManagerIdRanksGETResponse>(API_ROUTES.guilds.manager.id(guild.id).ranks._, {
			method: "GET",
		});

		setValue("ranks", res.ranks);
	};

	useEffect(() => {
		if (guild?.guild_ranks) {
			methods.reset({
				guild_id: guild.id,
				ranks: guild.guild_ranks,
			});
		}
	}, [guild, methods.reset]);

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button size="sm">Manager Ranks</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Manager Ranks</DialogTitle>
				</DialogHeader>

				<CreateNewRankForm guild_id={guild.id} onSuccessAction={reloadRanks} />

				<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
					<div className="rounded-md border">
						<Table>
							<TableBody>
								{watch("ranks").map((rank, index) => {
									return (
										<TableRow key={rank.id} className="border-none">
											<TableCell>
												<RHFTextField name={`ranks.${index}.name`} />
											</TableCell>
											<TableCell>
												<RHFSelect
													placeholder="Select a rank"
													name={`ranks.${index}.level`}
													onValueChange={(value) => setValue(`ranks.${index}.level`, Number.parseInt(value))}
													defaultValue={`${rank.level}`}
													options={[
														{ value: "3", label: "Leader" },
														{ value: "2", label: "Vice Leader" },
														{ value: "1", label: "Member" },
													]}
													keyValue="value"
													LabelOption="label"
												/>
											</TableCell>
											<TableCell>
												{index <= 2 ? (
													<Button variant={"outline"} disabled>
														<IconiFy icon={"ph:trash-simple"} />
													</Button>
												) : (
													<Button
														variant={"outline"}
														onClick={(e) => {
															e.preventDefault();
															onDelete(rank.id);
														}}
													>
														<IconiFy icon={"ph:trash-simple"} />
													</Button>
												)}
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</div>

					<DialogFooter>
						<DialogClose asChild>
							<Button variant="outline" id="closeDialog">
								Cancel
							</Button>
						</DialogClose>
						<Button disabled={isSubmitting} type="submit">
							Save
						</Button>
					</DialogFooter>
				</FormProvider>
			</DialogContent>
		</Dialog>
	);
};
